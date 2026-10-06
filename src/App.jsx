import { useState } from 'react'
import './App.css'

const defaultResume = `Product designer with 5 years of experience creating clear, accessible digital products.
Led end-to-end UX research, wireframing, prototyping, and usability testing for B2B SaaS platforms.
Partnered with engineering and product teams in Agile environments to improve activation by 24%.
Tools: Figma, FigJam, Jira, and Adobe Creative Suite.`

const defaultJob = `We are looking for a Senior Product Designer to shape intuitive experiences for our growing SaaS platform.
You will lead user research, interaction design, prototyping, and usability testing while collaborating with product managers and engineers.
Experience with Figma, design systems, accessibility, Agile, and data-informed decision making is a plus.`

const skillCatalog = [
  'javascript',
  'typescript',
  'python',
  'java',
  'c++',
  'c#',
  'react',
  'angular',
  'vue',
  'node.js',
  'express',
  'next.js',
  'html',
  'css',
  'sql',
  'nosql',
  'mongodb',
  'postgresql',
  'aws',
  'azure',
  'docker',
  'kubernetes',
  'git',
  'user research',
  'interaction design',
  'prototyping',
  'usability testing',
  'figma',
  'design systems',
  'accessibility',
  'agile',
  'data-informed',
  'jira',
  'saas',
  'wireframing',
]

const skillAliases = {
  javascript: ['javascript', 'js'],
  typescript: ['typescript', 'ts'],
  'node.js': ['node.js', 'nodejs', 'node js'],
  'next.js': ['next.js', 'nextjs', 'next js'],
  postgresql: ['postgresql', 'postgres'],
  nosql: ['nosql', 'no sql'],
}

const labelForSkill = (skill) => skill.replace('data-informed', 'data-informed decision making')
const containsSkill = (text, skill) => (skillAliases[skill] || [skill]).some((alias) => text.includes(alias))
const recommendationForSkill = (skill) => {
  const label = labelForSkill(skill)
  if (skill === 'aws' || skill === 'azure') return `Add ${label} experience or a cloud project that shows how you used it.`
  if (skill === 'docker' || skill === 'kubernetes') return `Add a ${label} project or describe how you used it to ship and run applications.`
  if (skill === 'sql' || skill === 'nosql' || skill === 'mongodb' || skill === 'postgresql') return `Add a project that demonstrates your ${label} data and database experience.`
  return `Add ${label} experience or a relevant project to your resume.`
}

const analyzeMatch = (resume, jobDescription) => {
  const resumeLower = resume.toLowerCase()
  const jobLower = jobDescription.toLowerCase()
  const requestedSkills = skillCatalog.filter((skill) => containsSkill(jobLower, skill))
  const matchingSkills = requestedSkills.filter((skill) => containsSkill(resumeLower, skill))
  const missingSkills = requestedSkills.filter((skill) => !containsSkill(resumeLower, skill))
  const score = requestedSkills.length
    ? Math.round((matchingSkills.length / requestedSkills.length) * 100)
    : 0

  const strength = score >= 80 ? 'Strong match' : score >= 60 ? 'Good foundation' : 'Needs work'
  const strengths = matchingSkills.map((skill) => `Experience with ${labelForSkill(skill)}`)
  const recommendations = missingSkills.length
    ? missingSkills.map(recommendationForSkill)
    : ['Your resume covers every detected skill. Keep the examples measurable and specific.']

  return { score, matchingSkills, missingSkills, strengths, recommendations, strength, skillCount: requestedSkills.length }
}

function App() {
  const [resume, setResume] = useState(defaultResume)
  const [jobDescription, setJobDescription] = useState(defaultJob)
  const [result, setResult] = useState(() => analyzeMatch(defaultResume, defaultJob))
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  const handleAnalyze = (event) => {
    event.preventDefault()
    setResult(analyzeMatch(resume, jobDescription))
    setHasAnalyzed(true)
  }

  const handleClear = () => {
    setResume('')
    setJobDescription('')
    setResult(analyzeMatch('', ''))
    setHasAnalyzed(false)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="AI Resume Match Analyzer home">
          <span className="brand-mark">✦</span>
          <span>AI Resume Match Analyzer</span>
        </a>
        <div className="header-badges">
          <span className="ai-badge"><span aria-hidden="true">✦</span> AI Powered Analysis</span>
          <span className="local-badge"><span className="status-dot" /> Private &amp; local</span>
        </div>
      </header>

      <section className="intro">
        <p className="eyebrow">Resume intelligence / 01</p>
        <h1>Find your fit <em>before</em> you apply.</h1>
        <p className="intro-copy">Compare your resume with a job description and get a clear match score in seconds.</p>
      </section>

      <form className="workspace" onSubmit={handleAnalyze}>
        <section className="input-column" aria-label="Resume and job description inputs">
          <div className="section-heading">
            <div>
              <span className="step-number">01</span>
              <h2>Compare your materials</h2>
            </div>
            <button type="button" className="text-button" onClick={handleClear}>Clear all</button>
          </div>

          <div className="input-grid">
            <div className="input-card">
              <label className="field-label" htmlFor="resume">Your Resume <span>Paste text</span></label>
              <textarea id="resume" value={resume} onChange={(event) => setResume(event.target.value)} placeholder="Paste your resume here..." />
              <div className="character-count">{resume.length} characters</div>
            </div>
            <div className="input-card">
              <label className="field-label" htmlFor="job-description">Job Description <span>Paste text</span></label>
              <textarea id="job-description" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the job description here..." />
              <div className="character-count">{jobDescription.length} characters</div>
            </div>
          </div>

          <button className="analyze-button" type="submit">
            Analyze Match <span aria-hidden="true">↗</span>
          </button>
          <p className="privacy-note"><span aria-hidden="true">✦</span> Your text stays in this browser and is never uploaded.</p>
        </section>

        {hasAnalyzed && <section className="results-column" aria-live="polite" aria-label="Match analysis results">
          <div className="section-heading result-heading">
            <div>
              <span className="step-number">02</span>
              <h2>Your match report</h2>
            </div>
            <span className="report-status">{result.skillCount ? 'Ready' : 'Waiting for input'}</span>
          </div>

          <div className="score-panel">
            <div className="score-ring" style={{ '--score': `${result.score * 3.6}deg` }}>
              <div className="score-inner"><strong>{result.score}</strong><span>/ 100</span></div>
            </div>
            <div className="score-summary">
              <span className="eyebrow">Overall compatibility</span>
              <h3>{result.strength}</h3>
              <p>{result.skillCount ? `${result.matchingSkills.length} of ${result.skillCount} role signals found in your resume.` : 'Add both pieces of text to see your score.'}</p>
            </div>
          </div>

          <div className="report-grid">
            <div className="report-block">
              <h3><span className="icon good">✓</span> Matching skills <small>{result.matchingSkills.length}</small></h3>
              <div className="skill-list">
                {result.matchingSkills.length ? result.matchingSkills.map((skill) => <span className="skill-chip" key={skill}><span className="skill-icon">✓</span>{labelForSkill(skill)}</span>) : <p className="empty-state">No matching skills yet.</p>}
              </div>
            </div>
            <div className="report-block">
              <h3><span className="icon missing">×</span> Missing Skills <small>{result.missingSkills.length}</small></h3>
              <div className="skill-list">
                {result.missingSkills.length ? result.missingSkills.map((skill) => <span className="skill-chip missing-chip" key={skill}><span className="skill-icon">×</span>{labelForSkill(skill)}</span>) : <p className="empty-state">Nothing missing from this scan.</p>}
              </div>
            </div>
          </div>

          <div className="insight-grid">
            <div className="insight-card strengths-card">
              <div className="insight-heading"><span className="insight-icon">✦</span><h3>Strengths</h3></div>
              <ul className="insight-list">
                {result.strengths.length ? result.strengths.map((strength) => <li key={strength}><span className="list-check">✓</span>{strength}</li>) : <li className="muted-list-item">No matching strengths detected yet.</li>}
              </ul>
            </div>
            <div className="insight-card recommendations-card">
              <div className="insight-heading"><span className="insight-icon">↗</span><h3>Recommendations</h3></div>
              <ul className="insight-list">
                {result.recommendations.map((recommendation) => <li key={recommendation}><span className="list-arrow">→</span>{recommendation}</li>)}
              </ul>
            </div>
          </div>
          <p className="score-method-note"><span aria-hidden="true">ⓘ</span> Score based on skill matching between your resume and the job description.</p>
        </section>}
      </form>
      <footer><span>AI Resume Match Analyzer</span><span>Frontend-only analysis</span></footer>
    </main>
  )
}

export default App
