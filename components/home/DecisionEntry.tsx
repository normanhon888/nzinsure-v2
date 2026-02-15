export default function DecisionEntry() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">

        <Card
          title="我的情况是否发生变化？"
          desc="家庭或生意结构改变，保障是否仍然适配？"
          link="/icura"
        />

        <Card
          title="我现在的保障是否真的合适？"
          desc="已经有保险，不代表结构合理。"
          link="/icura"
        />

        <Card
          title="哪些风险其实不需要保险？"
          desc="不是所有问题都需要购买解决。"
          link="/insights"
        />

      </div>
    </section>
  );
}

function Card({ title, desc, link }: any) {
  return (
    <div className="p-8 bg-white rounded-xl border">
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="mt-4 text-gray-600">{desc}</p>
      <a href={link} className="mt-6 inline-block text-black underline">
        进入判断
      </a>
    </div>
  );
}