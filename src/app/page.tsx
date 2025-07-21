import QuizContainer from './components/QuizContainer';
// keep page clean, SOC
export default function Home() {
  return (
    <div className="flex flex-col bg-gradient-to-r from-cyan-200 from- via-slate-50 via-50% to-red-200 to-">
        <QuizContainer />
    </div>
  );
}   