export const MITIGATION_STRATEGIES = {
  'Missed deadlines': 'Weekly sprint planning and milestone checkpoints',
  'Deadline pressure': 'Buffer time in schedule; prioritize critical path tasks',
  'Poor communication': 'Daily stand-up meetings and shared documentation',
  'Scope creep': 'Requirement freeze after design phase; change control board',
  'Lack of technical skills': 'Early training sessions and pair programming',
  'Team conflict': 'Defined roles, responsibilities, and conflict resolution protocol',
  'Requirement changes': 'Formal change request process with impact analysis',
  'Server crashes': 'Cloud hosting with auto-scaling and monitoring alerts',
  'Bugs': 'Automated testing, code reviews, and CI/CD pipeline',
  'Database failures': 'Regular backups and replication strategy',
  'API issues': 'API versioning, documentation, and integration tests',
  'Budget issues': 'Cost tracking spreadsheet and contingency reserve (10-15%)',
  'Lack of communication': 'Slack/Teams channel with response-time expectations',
};

export const SURVEY_RISK_OPTIONS = [
  'Team conflict',
  'Deadline pressure',
  'Poor communication',
  'Lack of technical skills',
  'Requirement changes',
  'Scope creep',
  'Server/API issues',
  'Budget constraints',
];

export function getMitigationForRisk(riskName) {
  const key = Object.keys(MITIGATION_STRATEGIES).find(
    (k) => k.toLowerCase() === riskName.toLowerCase()
  );
  return MITIGATION_STRATEGIES[key] || 'Document risk, assign owner, review weekly in team meetings';
}

export function suggestAIRecommendation(risk) {
  const base = getMitigationForRisk(risk.title);
  const level = risk.priority >= 20 ? 'Critical' : risk.priority >= 12 ? 'High' : risk.priority >= 6 ? 'Medium' : 'Low';
  return `[${level} Priority] ${base}. Consider ${risk.responseStrategy || 'mitigation'} strategy. Owner: ${risk.owner}.`;
}
