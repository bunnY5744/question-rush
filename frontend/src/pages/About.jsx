import AdPlaceholder from '../components/AdPlaceholder';
export default function About() {
  return (<section className="section prose">
    <h1>About Question Rush</h1>
    <p>Question Rush is a free online quiz game built around quick, satisfying brain training: math problems, number sequences, logical reasoning, pattern recognition and arithmetic puzzles.</p>
    <p>Every question on Question Rush is original content written for this site, and every question includes a short explanation so a wrong answer still teaches you something. Scores are validated on our server - the score you see is the score you actually earned.</p>
    <h2>How scoring works</h2>
    <p>Each correct answer is worth 10 points. You get 30 seconds per question, each question can only be submitted once, and your final accuracy is shown on the results page.</p>
    <h2>Who it is for</h2>
    <p>Students warming up before class, job applicants practising aptitude tests, and anyone who enjoys a two-minute mental workout. No account is needed to play.</p>
    <AdPlaceholder slot="about" />
  </section>);
}
