export default function LongTermModel() {
  return (
    <section className="py-24 bg-gray-100 text-center">
      <h2 className="text-3xl font-semibold mb-12">
        保险不应只在购买时出现
      </h2>

      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        <Item text="年度复盘" />
        <Item text="理赔后再评估" />
        <Item text="结构变化跟踪" />
        <Item text="关系节奏管理" />
      </div>
    </section>
  );
}

function Item({ text }: any) {
  return (
    <div className="p-6 bg-white rounded-lg border">
      {text}
    </div>
  );
}