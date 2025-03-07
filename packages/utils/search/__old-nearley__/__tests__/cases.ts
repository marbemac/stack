export const caseGroups = {
  freeform: [
    ['treats as a string', 'freeform'],
    ['mixed throughout', 'freeform1 age:5 freeform2 search'],
    ['quoted', '"a quoted:freeform" age:5'],
  ],

  'text filters': [
    ['works', 'plan:free'],
    ['multiple', 'plan:free age:5'],
    ['.-_ in keys', 'payments.plan-type_is:free'],
    ['@.-_ in values', 'email:jane@example.com type:public-company_x'],
    ['quoted value', 'user:"john doe"'],
    ['negation', '!plan:free'],
    ['negation in quoted', '!user:"john doe"'],
    ['partial filter still parses', 'age:> plan:free user:'],
  ],

  'in filters': [
    ['works', 'user:[jane, john doe] release:[12.0]'],
    ['negation', '!user:[jane, john doe]'],
  ],

  operators: [
    ['=', 'num_members:=5'],
    ['>', 'num_members:>5.0'],
    ['<', 'num_members:<5.0'],
    ['>=', 'num_members:>=5'],
    ['<=', 'num_members:<=5.0'],
  ],

  'relative time': [],

  functions: [
    ['no args', 'full_name()'],
    ['no args with space', 'full_name(  )'],
    ['single string arg', 'count(events)'],
    // ['', 'divide(projects, max_projects):>0.5']
  ],

  'logic groups': [],
};
