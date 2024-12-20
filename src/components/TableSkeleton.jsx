import { Skeleton } from "../components/shared/skeleton";

export function TableSkeleton({ isLoading, children }) {
    if (!isLoading) return <>{children}</>;
    const numberOfRows = 7;
    const numberOfColumns = 5;

    return (
        <div className="border m-2 sm:m16 border-gray-700 rounded-lg overflow-hidden ">
            <table className="min-w-full leading-normal ">
                <thead>
                    <tr>
                        {Array.from({ length: numberOfColumns }).map((_, colIndex) => (
                            <th
                                key={colIndex}
                                className="px-5 py-3 border-b-2 border-gray-700 bg-black text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                            >
                                <Skeleton className="h-4 w-full bg-gray-600" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: numberOfRows }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: numberOfColumns }).map((_, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="px-5 py-5 border-b border-[hsl(240,9%,25%)] bg-[hsl(240,9%,15%)]  text-sm"
                                >
                                    <Skeleton className="h-4 w-full bg-gray-600" />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

