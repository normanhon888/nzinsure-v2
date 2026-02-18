import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const HUBSPOT_BASE = 'https://api.hubapi.com'

// ==========================
// iCura Lead Engine v4+v5
// - v4: 状态机（Stage transitions）
// - v5: Orchestrator（24h 幂等 + Create/Update + 标准化命名 + 可选评分/Owner）
// ==========================

type LeadType = 'personal' | 'business' | 'project'

type LeadPayload = {
  name: string
  email: string
  phone?: string
  type: LeadType
  message?: string
}

// HubSpot-defined association: Deal <-> Contact
// 你之前用的 3 是对的
const ASSOC_TYPE_ID_CONTACT_TO_DEAL = 3

// ---------- 环境与来源 ----------
function getLeadSourceLabel(): string {
  // 可在 Vercel / .env.local 显式指定：LEAD_SOURCE
  const explicit = process.env.LEAD_SOURCE?.trim()
  if (explicit) return explicit

  // 默认按 Vercel 环境自动区分
  const env = (process.env.VERCEL_ENV ?? '').toLowerCase()
  if (env === 'production') return 'nzinsure-v2'
  if (env === 'preview') return 'nzinsure-v2-preview'
  return 'nzinsure-v2-local'
}

const LEAD_SOURCE = getLeadSourceLabel()

const IDEMPOTENCY_HOURS = Number(process.env.IDEMPOTENCY_HOURS ?? '24')
const IDEMPOTENCY_WINDOW_MS = Math.max(1, IDEMPOTENCY_HOURS) * 60 * 60 * 1000

function envTag(): 'prod' | 'preview' | 'local' {
  const v = (process.env.VERCEL_ENV ?? '').toLowerCase()
  if (v === 'production') return 'prod'
  if (v === 'preview') return 'preview'
  return 'local'
}

// ---------- Pipeline IDs（你已确认的三条） ----------
const PIPELINE_ID: Record<LeadType, string> = {
  // Insurance Sales Pipeline
  business:
    process.env.HS_PIPELINE_BUSINESS ??
    't_db8ac654822e3486e79e1d4f70308f57',

  // Personal Insurance Pipeline
  personal: process.env.HS_PIPELINE_PERSONAL ?? '3403406579',

  // Insurance Policies pipeline（internal id: default）
  project: process.env.HS_PIPELINE_PROJECT ?? 'default'
}

// ---------- Stage IDs ----------
// Business Pipeline（你截图里已完整取到 internal id）
const BUSINESS_STAGE = {
  NEW_LEAD: process.env.HS_STAGE_BUSINESS_NEW_LEAD ?? '3369994476',
  CONTACTED: process.env.HS_STAGE_BUSINESS_CONTACTED ?? '3369994477',
  NEEDS_ASSESSED:
    process.env.HS_STAGE_BUSINESS_NEEDS_ASSESSED ?? '3369994478',
  PROPOSAL_SENT:
    process.env.HS_STAGE_BUSINESS_PROPOSAL_SENT ?? '3369994479',
  IN_REVIEW: process.env.HS_STAGE_BUSINESS_IN_REVIEW ?? '3369994480',
  CLOSED_WON: process.env.HS_STAGE_BUSINESS_CLOSED_WON ?? '3369994481',
  CLOSED_LOST: process.env.HS_STAGE_BUSINESS_CLOSED_LOST ?? '3369994482'
} as const

// Personal Pipeline（你目前只拿到 New Enquiry 的 internal id；其余可后补 env）
const PERSONAL_STAGE = {
  NEW_ENQUIRY:
    process.env.HS_STAGE_PERSONAL_NEW_ENQUIRY ?? '4660104399',
  INFO_GATHERING: process.env.HS_STAGE_PERSONAL_INFO_GATHERING ?? '',
  QUOTE_SENT: process.env.HS_STAGE_PERSONAL_QUOTE_SENT ?? '',
  CLOSED_WON: process.env.HS_STAGE_PERSONAL_CLOSED_WON ?? '',
  CLOSED_LOST: process.env.HS_STAGE_PERSONAL_CLOSED_LOST ?? ''
} as const

// Project Pipeline（你目前拿到 Appointment Requested 的 internal id；其余可后补 env）
const PROJECT_STAGE = {
  APPOINTMENT_REQUESTED:
    process.env.HS_STAGE_PROJECT_APPOINTMENT_REQUESTED ?? '91802358'
  // 其他阶段可继续加 env：
  // WAITING_FOR_APPROVAL: process.env.HS_STAGE_PROJECT_WAITING_FOR_APPROVAL ?? '',
  // REQUESTED_QUOTE: process.env.HS_STAGE_PROJECT_REQUESTED_QUOTE ?? '',
  // ...
} as const

function initialStage(type: LeadType): string {
  if (type === 'business') return BUSINESS_STAGE.NEW_LEAD
  if (type === 'personal') return PERSONAL_STAGE.NEW_ENQUIRY
  return PROJECT_STAGE.APPOINTMENT_REQUESTED
}

// ---------- 可选：把评分写回 HubSpot（需要你先建好这些属性） ----------
const CONTACT_SCORE_PROPERTY =
  process.env.HS_CONTACT_SCORE_PROPERTY?.trim() || undefined
const CONTACT_SCORE_BAND_PROPERTY =
  process.env.HS_CONTACT_SCORE_BAND_PROPERTY?.trim() || undefined

const DEAL_SCORE_PROPERTY =
  process.env.HS_DEAL_SCORE_PROPERTY?.trim() || undefined
const DEAL_SCORE_BAND_PROPERTY =
  process.env.HS_DEAL_SCORE_BAND_PROPERTY?.trim() || undefined

// ---------- 可选：Owner Routing ----------
const OWNER_BY_TYPE: Partial<Record<LeadType, string>> = {
  business: process.env.HS_OWNER_BUSINESS_ID?.trim(),
  personal: process.env.HS_OWNER_PERSONAL_ID?.trim(),
  project: process.env.HS_OWNER_PROJECT_ID?.trim()
}
const DEFAULT_OWNER = process.env.HS_OWNER_DEFAULT_ID?.trim() || undefined

// ==========================
// helpers
// ==========================

function jsonResponse(
  status: number,
  payload: {
    success: boolean
    code: string
    message: string
    data: Record<string, unknown> | null
  }
) {
  return NextResponse.json(payload, { status })
}

function jsonError(
  status: number,
  code: string,
  message: string,
  data: Record<string, unknown> | null = null
) {
  return jsonResponse(status, { success: false, code, message, data })
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function safeTrim(v: unknown) {
  return typeof v === 'string' ? v.trim() : ''
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function dateTag(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

function buildDealName(data: LeadPayload) {
  // ✅ 强约束、可审计、跨环境不混
  // ICURA|BUSINESS|20260213|Norman Huang|prod
  const name = safeTrim(data.name) || 'Unknown'
  return `ICURA|${data.type.toUpperCase()}|${dateTag()}|${name}|${envTag()}`
}

function computeLeadScore(data: LeadPayload): {
  score: number
  band: 'A' | 'B' | 'C'
  reasons: string[]
} {
  const reasons: string[] = []
  let score = 50

  // type 权重
  if (data.type === 'project') {
    score += 25
    reasons.push('type:project')
  }
  if (data.type === 'business') {
    score += 15
    reasons.push('type:business')
  }
  if (data.type === 'personal') {
    score += 5
    reasons.push('type:personal')
  }

  // 手机号
  if (safeTrim(data.phone)) {
    score += 10
    reasons.push('has:phone')
  }

  // message 长度
  const msg = safeTrim(data.message)
  if (msg.length >= 30) {
    score += 10
    reasons.push('msg:>=30')
  }
  if (msg.length >= 120) {
    score += 10
    reasons.push('msg:>=120')
  }

  // 邮箱域名：公司域名小加分
  const email = normalizeEmail(data.email)
  const domain = email.split('@')[1] ?? ''
  const freeDomains = new Set([
    'gmail.com',
    'outlook.com',
    'hotmail.com',
    'yahoo.com',
    'icloud.com',
    'proton.me',
    'protonmail.com'
  ])
  if (domain && !freeDomains.has(domain)) {
    score += 5
    reasons.push('email:business-domain')
  }

  score = clamp(score, 0, 100)
  const band = score >= 80 ? 'A' : score >= 60 ? 'B' : 'C'
  return { score, band, reasons }
}

function pickOwnerId(type: LeadType, score: number): string | undefined {
  // 先按 type 分流；未来可扩展 score/region/workload
  return OWNER_BY_TYPE[type] || DEFAULT_OWNER
}

function parseHubspotDateMs(value: unknown): number | null {
  const s = safeTrim(value)
  if (!s) return null
  if (/^\d+$/.test(s)) {
    const n = Number(s)
    return Number.isFinite(n) ? n : null
  }
  const t = Date.parse(s)
  return Number.isFinite(t) ? t : null
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = 15000
): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(id)
  }
}

async function hsRequest<T = any>(
  token: string,
  path: string,
  init: RequestInit = {},
  timeoutMs?: number
): Promise<{ ok: boolean; status: number; data?: T; text?: string }> {
  const url = path.startsWith('http') ? path : `${HUBSPOT_BASE}${path}`
  const res = await fetchWithTimeout(
    url,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(init.headers ?? {})
      }
    },
    timeoutMs ?? 15000
  )

  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    const data = await res.json().catch(() => undefined)
    return { ok: res.ok, status: res.status, data }
  }
  const text = await res.text().catch(() => '')
  return { ok: res.ok, status: res.status, text }
}

// ==========================
// 1) Contact Upsert
// ==========================

async function upsertContact(params: {
  token: string
  data: LeadPayload
  scoreInfo: { score: number; band: 'A' | 'B' | 'C' }
  ownerId?: string
}): Promise<{ contactId: string; created: boolean }> {
  const { token, data, scoreInfo, ownerId } = params

  const email = normalizeEmail(data.email)
  const props: Record<string, string> = {
    email,
    firstname: safeTrim(data.name),
    lead_type: data.type,
    lead_source: LEAD_SOURCE
  }

  const phone = safeTrim(data.phone)
  if (phone) props.phone = phone

  const msg = safeTrim(data.message)
  if (msg) props.message = msg

  // 可选：写评分（需要你先在 HubSpot 建好属性）
  if (CONTACT_SCORE_PROPERTY) props[CONTACT_SCORE_PROPERTY] = String(scoreInfo.score)
  if (CONTACT_SCORE_BAND_PROPERTY) props[CONTACT_SCORE_BAND_PROPERTY] = scoreInfo.band

  // 可选：Owner
  if (ownerId) props.hubspot_owner_id = ownerId

  // 先尝试创建
  const create = await hsRequest<any>(token, `/crm/v3/objects/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ properties: props })
  })

  if (create.ok && create.data?.id) {
    return { contactId: String(create.data.id), created: true }
  }

  // 409 => 已存在，改走 update
  if (create.status !== 409) {
    console.error('HubSpot contact create failed:', create.status, create.data ?? create.text)
    throw new Error(`contact_create_failed:${create.status}`)
  }

  // 通过 email 读取 contact
  const existing = await hsRequest<any>(
    token,
    `/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`
  )

  if (!existing.ok || !existing.data?.id) {
    console.error('HubSpot contact lookup failed:', existing.status, existing.data ?? existing.text)
    throw new Error(`contact_lookup_failed:${existing.status}`)
  }

  const contactId = String(existing.data.id)

  const update = await hsRequest<any>(token, `/crm/v3/objects/contacts/${contactId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ properties: props })
  })

  if (!update.ok) {
    console.error('HubSpot contact update failed:', update.status, update.data ?? update.text)
    throw new Error(`contact_update_failed:${update.status}`)
  }

  return { contactId, created: false }
}

// ==========================
// 2) Deal read helpers
// ==========================

type DealRecord = {
  id: string
  properties: Record<string, any>
}

async function getDealIdsForContact(token: string, contactId: string) {
  const res = await hsRequest<any>(
    token,
    `/crm/v3/objects/contacts/${contactId}/associations/deals?limit=100`
  )

  if (!res.ok) {
    console.error('HubSpot associations (contact->deals) failed:', res.status, res.data ?? res.text)
    return [] as string[]
  }

  const results = res.data?.results ?? []
  return results.map((r: any) => String(r.id)).filter(Boolean)
}

async function batchReadDeals(token: string, dealIds: string[]): Promise<DealRecord[]> {
  if (dealIds.length === 0) return []

  const res = await hsRequest<any>(token, `/crm/v3/objects/deals/batch/read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      inputs: dealIds.map((id) => ({ id })),
      properties: [
        'dealname',
        'dealstage',
        'pipeline',
        'createdate',
        'hs_is_closed',
        'hubspot_owner_id'
      ]
    })
  })

  if (!res.ok) {
    console.error('HubSpot deal batch read failed:', res.status, res.data ?? res.text)
    return []
  }

  return (res.data?.results ?? []).map((d: any) => ({
    id: String(d.id),
    properties: d.properties ?? {}
  }))
}

function isDealOpen(deal: DealRecord): boolean {
  const v = safeTrim(deal.properties?.hs_is_closed)
  // HubSpot 常见返回：'true'/'false'
  if (v === 'true') return false
  if (v === 'false') return true

  // 兜底：如果没给 hs_is_closed，就按业务 pipeline 的 closed stage 判断（仅 business 有完整 stage）
  const stage = safeTrim(deal.properties?.dealstage)
  if (stage && (stage === BUSINESS_STAGE.CLOSED_WON || stage === BUSINESS_STAGE.CLOSED_LOST)) {
    return false
  }
  return true
}

function pickRecentOpenDealWithinWindow(params: {
  deals: DealRecord[]
  pipelineId: string
  windowStartMs: number
}) {
  const { deals, pipelineId, windowStartMs } = params

  const candidates = deals
    .filter((d) => safeTrim(d.properties?.pipeline) === pipelineId)
    .filter((d) => isDealOpen(d))
    .map((d) => {
      const createdMs = parseHubspotDateMs(d.properties?.createdate) ?? 0
      return { deal: d, createdMs }
    })
    .filter((x) => x.createdMs >= windowStartMs)
    .sort((a, b) => b.createdMs - a.createdMs)

  return candidates[0]?.deal
}

// ==========================
// 3) Stage Machine（核心）
// ==========================

type StageDecision = {
  nextStageId: string
  reason: string
  changed: boolean
}

function linearAdvance(currentStageId: string | null, flow: string[]): StageDecision {
  const current = currentStageId ?? flow[0]
  const idx = flow.indexOf(current)

  if (idx < 0) {
    return { nextStageId: current, reason: 'stage_not_in_flow', changed: false }
  }

  if (idx >= flow.length - 1) {
    return { nextStageId: current, reason: 'already_at_max_open_stage', changed: false }
  }

  const next = flow[idx + 1]
  return { nextStageId: next, reason: 'linear_advance', changed: next !== current }
}

function computeNextStage(params: {
  type: LeadType
  currentStageId: string | null
  score: number
  message?: string
}): StageDecision {
  const { type, currentStageId, score, message } = params
  const msgLen = safeTrim(message).length

  // business：完整状态机 + 规则升级
  if (type === 'business') {
    const flow = [
      BUSINESS_STAGE.NEW_LEAD,
      BUSINESS_STAGE.CONTACTED,
      BUSINESS_STAGE.NEEDS_ASSESSED,
      BUSINESS_STAGE.PROPOSAL_SENT,
      BUSINESS_STAGE.IN_REVIEW
    ]

    const current = currentStageId ?? BUSINESS_STAGE.NEW_LEAD

    // 已关闭不动
    if (current === BUSINESS_STAGE.CLOSED_WON || current === BUSINESS_STAGE.CLOSED_LOST) {
      return { nextStageId: current, reason: 'deal_closed', changed: false }
    }

    // 先默认线性推进 1 步
    let decision = linearAdvance(current, flow)

    // 规则：高分/长信息 => 允许跳级（但不越过 IN_REVIEW）
    const idxOf = (s: string) => flow.indexOf(s)

    // score >= 80 -> 至少 NEEDS_ASSESSED
    if (score >= 80) {
      const target = BUSINESS_STAGE.NEEDS_ASSESSED
      if (idxOf(target) > idxOf(decision.nextStageId)) {
        decision = {
          nextStageId: target,
          reason: 'score>=80_jump_to_needs_assessed',
          changed: target !== current
        }
      }
    }

    // msg >= 60 -> 至少 PROPOSAL_SENT
    if (msgLen >= 60) {
      const target = BUSINESS_STAGE.PROPOSAL_SENT
      if (idxOf(target) > idxOf(decision.nextStageId)) {
        decision = {
          nextStageId: target,
          reason: 'msg>=60_jump_to_proposal_sent',
          changed: target !== current
        }
      }
    }

    // msg >= 120 -> 至少 IN_REVIEW
    if (msgLen >= 120) {
      const target = BUSINESS_STAGE.IN_REVIEW
      if (idxOf(target) > idxOf(decision.nextStageId)) {
        decision = {
          nextStageId: target,
          reason: 'msg>=120_jump_to_in_review',
          changed: target !== current
        }
      }
    }

    // 如果当前阶段已比 target 更后，则保持不回退
    const currentIdx = idxOf(current)
    const nextIdx = idxOf(decision.nextStageId)
    if (currentIdx >= 0 && nextIdx >= 0 && nextIdx < currentIdx) {
      return { nextStageId: current, reason: 'no_regress', changed: false }
    }

    // 如果 next 与 current 相同，则不更新
    return {
      nextStageId: decision.nextStageId,
      reason: decision.reason,
      changed: decision.nextStageId !== current
    }
  }

  // personal：如果你补齐 env（INFO_GATHERING/QUOTE_SENT），就会自动线性推进
  if (type === 'personal') {
    const flow = [
      PERSONAL_STAGE.NEW_ENQUIRY,
      PERSONAL_STAGE.INFO_GATHERING,
      PERSONAL_STAGE.QUOTE_SENT
    ].filter(Boolean)

    // 未补齐就只有一个 stage => 不会推进
    return linearAdvance(currentStageId ?? flow[0], flow)
  }

  // project：目前默认不推进（你后续补齐 stages 再打开）
  const flow = [PROJECT_STAGE.APPOINTMENT_REQUESTED].filter(Boolean)
  return linearAdvance(currentStageId ?? flow[0], flow)
}

// ==========================
// 4) Deal Create / Update
// ==========================

async function patchDeal(token: string, dealId: string, properties: Record<string, any>) {
  const res = await hsRequest<any>(token, `/crm/v3/objects/deals/${dealId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ properties })
  })

  if (!res.ok) {
    console.error('HubSpot deal patch failed:', res.status, res.data ?? res.text)
    throw new Error(`deal_patch_failed:${res.status}`)
  }
}

async function createDeal(params: {
  token: string
  contactId: string
  pipelineId: string
  stageId: string
  dealName: string
  ownerId?: string
  scoreInfo: { score: number; band: 'A' | 'B' | 'C' }
  message?: string
}) {
  const { token, contactId, pipelineId, stageId, dealName, ownerId, scoreInfo, message } = params

  const properties: Record<string, any> = {
    dealname: dealName,
    pipeline: pipelineId,
    dealstage: stageId
  }

  // 可选：Owner
  if (ownerId) properties.hubspot_owner_id = ownerId

  // 可选：把 message 写入 deal 描述（标准属性，一般存在）
  const msg = safeTrim(message)
  if (msg) properties.description = msg

  // 可选：写评分（需要你先建 deal 属性）
  if (DEAL_SCORE_PROPERTY) properties[DEAL_SCORE_PROPERTY] = String(scoreInfo.score)
  if (DEAL_SCORE_BAND_PROPERTY) properties[DEAL_SCORE_BAND_PROPERTY] = scoreInfo.band

  const res = await hsRequest<any>(token, `/crm/v3/objects/deals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      properties,
      associations: [
        {
          to: { id: contactId },
          types: [
            {
              associationCategory: 'HUBSPOT_DEFINED',
              associationTypeId: ASSOC_TYPE_ID_CONTACT_TO_DEAL
            }
          ]
        }
      ]
    })
  })

  if (!res.ok) {
    console.error('HubSpot deal create failed:', res.status, res.data ?? res.text)
    throw new Error(`deal_create_failed:${res.status}`)
  }

  return String(res.data?.id)
}

// ==========================
// POST handler
// ==========================

export async function POST(req: Request) {
  try {
    const raw = (await req.json().catch(() => null)) as Partial<LeadPayload> | null
    if (!raw) return jsonError(400, 'INVALID_JSON', 'Invalid JSON payload.')

    const data: LeadPayload = {
      name: safeTrim(raw.name),
      email: normalizeEmail(safeTrim(raw.email)),
      phone: safeTrim(raw.phone) || undefined,
      type: raw.type as LeadType,
      message: safeTrim(raw.message) || undefined
    }

    if (!data.name || !data.email || !data.type) {
      return jsonError(
        400,
        'MISSING_REQUIRED_FIELDS',
        'Name, email, and type are required.'
      )
    }
    if (!['personal', 'business', 'project'].includes(data.type)) {
      return jsonError(400, 'INVALID_LEAD_TYPE', 'Invalid lead type.')
    }
    if (!isEmailValid(data.email)) {
      return jsonError(400, 'INVALID_EMAIL', 'Invalid email address.')
    }

    const token = process.env.HUBSPOT_TOKEN
    if (!token) {
      return jsonError(
        500,
        'HUBSPOT_TOKEN_MISSING',
        'HubSpot token is not configured.'
      )
    }

    // 计算评分 + owner（v5 orchestrator 的基础）
    const scoreInfo = computeLeadScore(data)
    const ownerId = pickOwnerId(data.type, scoreInfo.score)

    // ==========================
    // 1) UPSERT CONTACT
    // ==========================
    const { contactId, created: contactCreated } = await upsertContact({
      token,
      data,
      scoreInfo,
      ownerId
    })

    // ==========================
    // 2) 24h 幂等：找最近 open deal（同 pipeline）
    // ==========================
    const pipelineId = PIPELINE_ID[data.type]
    const windowStartMs = Date.now() - IDEMPOTENCY_WINDOW_MS

    const dealIds = await getDealIdsForContact(token, contactId)
    const deals = await batchReadDeals(token, dealIds)

    const recentOpenDeal = pickRecentOpenDealWithinWindow({
      deals,
      pipelineId,
      windowStartMs
    })

    // ==========================
    // 3) 状态机：决定下一 stage
    //    - 若 24h 内已有 open deal：只 update（不新建）
    //    - 否则：create 新 deal（初始 stage）
    // ==========================

    const standardDealName = buildDealName(data)

    if (recentOpenDeal) {
      const currentStage = safeTrim(recentOpenDeal.properties?.dealstage) || null
      const decision = computeNextStage({
        type: data.type,
        currentStageId: currentStage,
        score: scoreInfo.score,
        message: data.message
      })

      const patch: Record<string, any> = {}

      // stage upgrade（仅当 changed）
      if (decision.changed) patch.dealstage = decision.nextStageId

      // 命名标准化（只要不一致就修正）
      const currentName = safeTrim(recentOpenDeal.properties?.dealname)
      if (currentName !== standardDealName) patch.dealname = standardDealName

      // owner（如果原来没 owner 且我们有 ownerId）
      const currentOwner = safeTrim(recentOpenDeal.properties?.hubspot_owner_id)
      if (!currentOwner && ownerId) patch.hubspot_owner_id = ownerId

      // 可选：评分写回 deal
      if (DEAL_SCORE_PROPERTY) patch[DEAL_SCORE_PROPERTY] = String(scoreInfo.score)
      if (DEAL_SCORE_BAND_PROPERTY) patch[DEAL_SCORE_BAND_PROPERTY] = scoreInfo.band

      // 可选：补 description
      if (data.message) patch.description = safeTrim(data.message)

      if (Object.keys(patch).length > 0) {
        await patchDeal(token, recentOpenDeal.id, patch)
      }

      return jsonResponse(200, {
        success: true,
        code: 'LEAD_UPDATED_EXISTING_DEAL',
        message: 'Lead processed by updating an existing deal within 24 hours.',
        data: {
          mode: 'updated_existing_deal_within_24h',
          contactCreated,
          contactId,
          dealId: recentOpenDeal.id,
          pipelineId,
          stageDecision: decision,
          leadScore: scoreInfo
        }
      })
    }

    // 24h 内没有 open deal => 创建新 deal
    const newDealId = await createDeal({
      token,
      contactId,
      pipelineId,
      stageId: initialStage(data.type),
      dealName: standardDealName,
      ownerId,
      scoreInfo,
      message: data.message
    })

    return jsonResponse(200, {
      success: true,
      code: 'LEAD_CREATED_NEW_DEAL',
      message: 'Lead processed by creating a new deal.',
      data: {
        mode: 'created_new_deal',
        contactCreated,
        contactId,
        dealId: newDealId,
        pipelineId,
        stageId: initialStage(data.type),
        leadScore: scoreInfo
      }
    })
  } catch (err) {
    console.error('Lead Engine error:', err)
    return jsonError(500, 'SERVER_ERROR', 'Server error.', null)
  }
}
