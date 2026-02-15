import Hero from "../components/home/Hero";
import DecisionEntry from "../components/home/DecisionEntry";
import HowWeWork from "../components/home/HowWeWork";
import LongTermModel from "../components/home/LongTermModel";
import FinalCTA from "../components/home/FinalCTA";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <DecisionEntry />
      <HowWeWork />
      <LongTermModel />
      <FinalCTA />
    </main>
  );
}