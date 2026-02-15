export default function HowWeWork() {
  return (
    <section className="py-24 text-center">
      <h2 className="text-3xl font-semibold mb-12">
        我们如何工作
      </h2>

      <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
        <Step title="先理解" desc="澄清风险结构，而不是介绍产品。" />
        <Step title="再判断" desc="结构化问题帮助你理清逻辑。" />
        <Step title="最后行动" desc="只有在合适时，才进入人工咨询。" />
      </div>
    </section>
  );
}

function Step({ title, desc }: any) {
  return (
    <div>
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="mt-4 text-gray-600">{desc}</p>
    </div>
  );
}