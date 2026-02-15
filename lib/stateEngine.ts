export type ClientState =
  | "STABLE"
  | "REVIEW_REQUIRED"
  | "UNCERTAIN"
  | "HIGH_ATTENTION"

export function evaluateState(eventType: string): ClientState {
  switch (eventType) {
    case "CLIENT_NO_CHANGE":
      return "STABLE"

    case "CLIENT_MAJOR_CHANGE":
      return "REVIEW_REQUIRED"

    case "CLIENT_UNCERTAIN":
      return "UNCERTAIN"

    default:
      return "STABLE"
  }
}