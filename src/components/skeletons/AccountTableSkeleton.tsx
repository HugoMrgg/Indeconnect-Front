import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function AccountTableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left"><Skeleton width={60} /></th>
                        <th className="px-6 py-4 text-left"><Skeleton width={80} /></th>
                        <th className="px-6 py-4 text-left"><Skeleton width={60} /></th>
                        <th className="px-6 py-4 text-left"><Skeleton width={80} /></th>
                        <th className="px-6 py-4 text-left"><Skeleton width={100} /></th>
                        <th className="px-6 py-4 text-left"><Skeleton width={80} /></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4"><Skeleton width={180} /></td>
                            <td className="px-6 py-4"><Skeleton width={120} /></td>
                            <td className="px-6 py-4"><Skeleton width={80} height={24} borderRadius={12} /></td>
                            <td className="px-6 py-4"><Skeleton width={100} height={24} borderRadius={12} /></td>
                            <td className="px-6 py-4"><Skeleton width={100} /></td>
                            <td className="px-6 py-4"><Skeleton width={100} height={32} borderRadius={8} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
