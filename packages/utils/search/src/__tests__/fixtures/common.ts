export const caseGroups = {
  'text filters': [
    ['works', 'plan:free'],
    ['multiple', 'plan:free age:5'],
    ['.-_[0-9] in keys', 'payments.plan-type_is2:free'],
    ['keys that start with a $', '$last_seen:foo'],
    ['keys with a period and $', 'company.$id:123'],
    ['@.-_ in values', 'email:jane@example.com type:public-company_x'],
    ['quoted value', 'user:"john doe"'],
    ['negation', '!plan:free'],
    ['negation in quoted', '!user:"john doe"'],
    ['partial filter still parses', 'age:> plan:free user:'],
  ],

  'in filters': [
    ['works', 'user:[jane, john]'],
    ['negation', '!user:[jane, john]'],
    ['numbers', 'release:[12.0]'],
    ['quoted', 'release:[jane, "john doe"]'],
  ],

  boolean: [
    ['true', 'plan:true'],
    ['false', 'plan:false'],
  ],

  operators: [
    ['=', 'num_members:=5'],
    ['>', 'num_members:>5.0'],
    ['<', 'num_members:<5.0'],
    ['>=', 'num_members:>=5'],
    ['<=', 'num_members:<=5.0'],
  ],

  dates: [
    ['date only', 'last_seen:>2024-01-12'],
    ['date time', 'last_seen:2024-01-12T10:15:01'],
  ],

  'relative date': [
    ['-', 'last_seen:-1d'],
    ['+', 'renews_at:+30d'],
    ['floats are not allowed', 'renews_at:+1.2s'],
    ['with other filters', 'plan:free renews_at:+4w'],
  ],

  functions: [
    ['no args', 'full_name()'],
    ['no args with space', 'full_name(  )'],
    ['single string arg', 'count(events)'],
    ['with rhs', 'divide(projects, max_projects):>0.5'],
    ['with filter argument', 'count(projects, plan:free !has:email):>5'],
    ['with quoted argument', 'count(projects, "free search"):>0.5'],
    ['relative date rhs', 'last_seen():-7d'],
    ['number arguments', 'my_func(2, 0.5, -2)'],
    ['boolean arguments', 'my_func(true, false)'],
    ['boolean rhs', 'my_func():true'],
  ],
};
