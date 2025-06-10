import { VariableData } from '../types';

interface VariableTableProps {
  variables: VariableData;
}

export default function VariableTable({ variables }: VariableTableProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Variables</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Variable</th>
            <th className="border p-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(variables).map(([key, value]) => (
            <tr key={key}>
              <td className="border p-2">{key}</td>
              <td className="border p-2">{JSON.stringify(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}