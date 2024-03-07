export const cases = [
  ['treats freeform as a string', 'freeform'],
  ['supports qualifiers', 'plan:enterprise age:5'],
  ['supports .-_ in qualifiers', 'payments.plan-type_is:enterprise'],
  ['supports @.-_ in qualifier values', 'email:jane@example.com type:public-company_x'],
  ['supports quoted qualifiers', 'user:"john doe"'],
  ['supports freeform search mixed throughout', 'freeform1 age:5 freeform2 search'],
  ['supports multiple values on the same key', 'user:[jane, john doe] release:[12.0]'],
  ['supports operators', 'num_members:>5.0'],
];
