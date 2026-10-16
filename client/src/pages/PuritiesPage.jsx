import EntityPage from '../components/EntityPage';

export const meta = {path: '/purities', title: 'Purities', group: 'Inventory', order: 1};

const fields = [
  {name: 'code', label: 'Code', type: 'string', required: true},
  {name: 'metal', label: 'Metal', type: 'enum', options: ['gold', 'silver', 'platinum']},
  {name: 'karat', label: 'Karat', type: 'number'},
  {name: 'fineness', label: 'Fineness (per 1000)', type: 'number', required: true},
  {name: 'description', label: 'Description', type: 'string'},
];

export default function PuritiesPage() {
  return <EntityPage resource="purities" title={meta.title} fields={fields} />;
}
