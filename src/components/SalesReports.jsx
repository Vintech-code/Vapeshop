import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiInfo, FiFileText, FiTrendingUp, FiUsers, FiDollarSign, FiClock, FiDownload } from 'react-icons/fi';
import SideMenu from '../layouts/SideMenu';
import Header from '../layouts/Header';

// Mock detailed sales data for demonstration
const mockSales = [
    {
        id: 1, customer: "John Doe", total: 45.99, date: "2025-04-15", items: 3, products: [
            { name: "Vape Mod", qty: 1, price: 30, cost: 20, category: "Device", payment: "cash", discount: 0, tax: 3 },
            { name: "E-Liquid", qty: 2, price: 8, cost: 4, category: "Liquid", payment: "cash", discount: 1, tax: 1 }
        ], cashier: "Joyce", hour: 10, refund: false, branch: "Main"
    },
    {
        id: 2, customer: "Jane Smith", total: 89.49, date: "2025-04-14", items: 5, products: [
            { name: "Vape Coil", qty: 3, price: 10, cost: 5, category: "Accessory", payment: "card", discount: 0, tax: 1.5 },
            { name: "E-Liquid", qty: 2, price: 8, cost: 4, category: "Liquid", payment: "card", discount: 2, tax: 1 }
        ], cashier: "Anna", hour: 14, refund: false, branch: "Main"
    },
    {
        id: 3, customer: "Alice Johnson", total: 23.99, date: "2025-04-13", items: 2, products: [
            { name: "Disposable Vape", qty: 1, price: 20, cost: 12, category: "Device", payment: "mobile", discount: 0, tax: 2 },
            { name: "E-Liquid", qty: 1, price: 8, cost: 4, category: "Liquid", payment: "mobile", discount: 0, tax: 1 }
        ], cashier: "Joyce", hour: 17, refund: false, branch: "Branch 2"
    },
    {
        id: 4, customer: "Michael Brown", total: 120.00, date: "2025-04-12", items: 7, products: [
            { name: "Vape Mod", qty: 2, price: 30, cost: 20, category: "Device", payment: "cash", discount: 0, tax: 6 },
            { name: "Vape Coil", qty: 5, price: 10, cost: 5, category: "Accessory", payment: "cash", discount: 0, tax: 2.5 }
        ], cashier: "Anna", hour: 11, refund: false, branch: "Main"
    },
    {
        id: 5, customer: "Emily Davis", total: 75.50, date: "2025-04-11", items: 4, products: [
            { name: "E-Liquid", qty: 4, price: 8, cost: 4, category: "Liquid", payment: "card", discount: 4, tax: 2 }
        ], cashier: "Joyce", hour: 13, refund: true, refundReason: "Wrong flavor", branch: "Branch 2"
    },
    {
        id: 6, customer: "Chris Wilson", total: 60.75, date: "2025-04-10", items: 6, products: [
            { name: "Vape Coil", qty: 6, price: 10, cost: 5, category: "Accessory", payment: "mobile", discount: 0, tax: 3 }
        ], cashier: "Anna", hour: 16, refund: false, branch: "Main"
    },
];

// Helper functions
function getProductSales(sales) {
    const map = {};
    sales.forEach(sale => {
        sale.products?.forEach(p => {
            if (!map[p.name]) map[p.name] = { ...p, qty: 0, sales: 0, revenue: 0, cost: 0, profit: 0, category: p.category };
            map[p.name].qty += p.qty;
            map[p.name].sales += p.qty;
            map[p.name].revenue += p.price * p.qty;
            map[p.name].cost += p.cost * p.qty;
            map[p.name].profit += (p.price - p.cost) * p.qty;
        });
    });
    return Object.values(map);
}
function getCategorySummary(productSales) {
    const map = {};
    productSales.forEach(p => {
        if (!map[p.category]) map[p.category] = { sales: 0, revenue: 0, cost: 0, profit: 0 };
        map[p.category].sales += p.sales;
        map[p.category].revenue += p.revenue;
        map[p.category].cost += p.cost;
        map[p.category].profit += p.profit;
    });
    return map;
}
function getPaymentSummary(sales) {
    const map = {};
    sales.forEach(sale => {
        sale.products?.forEach(p => {
            map[p.payment] = (map[p.payment] || 0) + 1;
        });
    });
    return map;
}
function getDiscountSummary(sales) {
    let totalDiscount = 0, count = 0;
    sales.forEach(sale => {
        sale.products?.forEach(p => {
            if (p.discount > 0) {
                totalDiscount += p.discount * p.qty;
                count += p.qty;
            }
        });
    });
    return { totalDiscount, count };
}
function getTaxSummary(sales) {
    const map = {};
    sales.forEach(sale => {
        sale.products?.forEach(p => {
            if (!map[p.category]) map[p.category] = 0;
            map[p.category] += p.tax * p.qty;
        });
    });
    return map;
}
function getProfitMargin(productSales) {
    return productSales.map(p => ({
        ...p,
        margin: p.revenue ? (((p.revenue - p.cost) / p.revenue) * 100).toFixed(1) : "0"
    }));
}
function getRefunds(sales) {
    return sales.filter(sale => sale.refund);
}
function getStaffPerformance(sales) {
    const map = {};
    sales.forEach(sale => {
        map[sale.cashier] = (map[sale.cashier] || 0) + 1;
    });
    return map;
}
function getHourlySales(sales) {
    const hours = Array(24).fill(0);
    sales.forEach(sale => {
        hours[sale.hour]++;
    });
    return hours;
}
function getPeriodSummary(sales, period = 'day') {
    const map = {};
    sales.forEach(sale => {
        let key = sale.date;
        if (period === 'month') key = sale.date.slice(0, 7);
        map[key] = (map[key] || 0) + sale.total;
    });
    return map;
}
function getCustomerTrends(sales) {
    const map = {};
    sales.forEach(sale => {
        if (!map[sale.customer]) map[sale.customer] = { count: 0, total: 0 };
        map[sale.customer].count += 1;
        map[sale.customer].total += sale.total;
    });
    return map;
}
function getBranchComparison(sales) {
    const map = {};
    sales.forEach(sale => {
        if (!map[sale.branch]) map[sale.branch] = 0;
        map[sale.branch] += sale.total;
    });
    return map;
}

// Export helpers (CSV, Excel, PDF)
function exportCSV(data, filename) {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    for (const row of data) {
        csvRows.push(headers.map(h => JSON.stringify(row[h] ?? '')).join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}
function exportExcel(data, filename) {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    let html = '<table><tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
    for (const row of data) {
        html += '<tr>' + headers.map(h => `<td>${row[h] ?? ''}</td>`).join('') + '</tr>';
    }
    html += '</table>';
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}
function exportPDF() {
    window.print();
}

const SalesReports = () => {
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showHourly, setShowHourly] = useState(false);
    const [showRefunds, setShowRefunds] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setSales(mockSales);
        setIsLoading(false);
    }, []);

    // Derived data
    const productSales = getProductSales(sales);
    const categorySummary = getCategorySummary(productSales);
    const paymentSummary = getPaymentSummary(sales);
    const discountSummary = getDiscountSummary(sales);
    const taxSummary = getTaxSummary(sales);
    const profitMargins = getProfitMargin(productSales);
    const refunds = getRefunds(sales);
    const staffPerf = getStaffPerformance(sales);
    const hourlySales = getHourlySales(sales);
    const dailySummary = getPeriodSummary(sales, 'day');
    const monthlySummary = getPeriodSummary(sales, 'month');
    const customerTrends = getCustomerTrends(sales);
    const branchComparison = getBranchComparison(sales);

    // Best/Least selling
    const bestSelling = [...productSales].sort((a, b) => b.sales - a.sales)[0];
    const leastSelling = [...productSales].sort((a, b) => a.sales - b.sales)[0];

    // High-value customers (top 3 by total spent)
    const highValueCustomers = Object.entries(customerTrends)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 3);

    // Repeat buyers (more than 1 purchase)
    const repeatBuyers = Object.entries(customerTrends)
        .filter(([_, v]) => v.count > 1)
        .map(([name, v]) => ({ name, ...v }));

    const handleMoreDetails = (id) => {
        navigate(`/sales/${id}`);
    };

    // Export all sales as CSV/Excel
    const handleExportCSV = () => {
        // Flatten sales for CSV
        const flat = [];
        sales.forEach(sale => {
            sale.products.forEach(p => {
                flat.push({
                    SaleID: sale.id,
                    Customer: sale.customer,
                    Product: p.name,
                    Category: p.category,
                    Qty: p.qty,
                    Price: p.price,
                    Discount: p.discount,
                    Tax: p.tax,
                    Payment: p.payment,
                    Cashier: sale.cashier,
                    Date: sale.date,
                    Refund: sale.refund ? 'Yes' : 'No',
                    RefundReason: sale.refundReason || '',
                    Branch: sale.branch || '',
                });
            });
        });
        exportCSV(flat, 'sales-report.csv');
    };
    const handleExportExcel = () => {
        const flat = [];
        sales.forEach(sale => {
            sale.products.forEach(p => {
                flat.push({
                    SaleID: sale.id,
                    Customer: sale.customer,
                    Product: p.name,
                    Category: p.category,
                    Qty: p.qty,
                    Price: p.price,
                    Discount: p.discount,
                    Tax: p.tax,
                    Payment: p.payment,
                    Cashier: sale.cashier,
                    Date: sale.date,
                    Refund: sale.refund ? 'Yes' : 'No',
                    RefundReason: sale.refundReason || '',
                    Branch: sale.branch || '',
                });
            });
        });
        exportExcel(flat, 'sales-report.xls');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sticky SideMenu */}
            <div className="h-screen sticky top-0 left-0 z-20">
                <SideMenu />
            </div>
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                <FiFileText className="text-blue-600" /> Sales Report
                            </h1>
                            <div className="flex gap-2">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
                                    onClick={handleExportCSV}
                                >
                                    <FiDownload /> Export CSV
                                </button>
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
                                    onClick={handleExportExcel}
                                >
                                    <FiDownload /> Export Excel
                                </button>
                                <button
                                    className="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
                                    onClick={exportPDF}
                                >
                                    <FiDownload /> Export PDF
                                </button>
                            </div>
                        </div>

                        {/* Product Sales Breakdown */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <FiTrendingUp /> Product Sales Breakdown
                            </h2>
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg mb-2">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-800 font-bold text-center">
                                        <th className="px-4 py-2 text-center">Product</th>
                                        <th className="px-4 py-2 text-center">Category</th>
                                        <th className="px-4 py-2 text-center">Units Sold</th>
                                        <th className="px-4 py-2 text-center">Revenue</th>
                                        <th className="px-4 py-2 text-center">Profit</th>
                                        <th className="px-4 py-2 text-center">Margin (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productSales.map(p => (
                                        <tr key={p.name}
                                            className={
                                                p.name === bestSelling?.name
                                                    ? "bg-green-100 font-bold text-center"
                                                    : p.name === leastSelling?.name
                                                    ? "bg-red-100 text-center"
                                                    : "text-center"
                                            }
                                        >
                                            <td className="px-4 py-2 text-center">{p.name}</td>
                                            <td className="px-4 py-2 text-center">{p.category}</td>
                                            <td className="px-4 py-2 text-center">{p.sales}</td>
                                            <td className="px-4 py-2 text-center">₱{p.revenue.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-center">₱{p.profit.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-center">{p.margin}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="text-sm text-gray-600">
                                <span className="bg-green-100 px-2 py-1 rounded mr-2">Best Seller: {bestSelling?.name}</span>
                                <span className="bg-red-100 px-2 py-1 rounded">Least Seller: {leastSelling?.name}</span>
                            </div>
                        </div>

                        {/* Daily/Monthly Sales Summary */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <FiClock /> Daily Sales Summary
                            </h2>
                            <div className="flex gap-4 overflow-x-auto">
                                {Object.entries(dailySummary).map(([date, total]) => (
                                    <div key={date} className="bg-blue-100 rounded p-4 text-center flex-1 min-w-[120px]">
                                        <div className="font-bold">{date}</div>
                                        <div className="text-lg">₱{total.toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                            <h2 className="text-xl font-semibold mt-6 mb-2 flex items-center gap-2">
                                <FiClock /> Monthly Sales Summary
                            </h2>
                            <div className="flex gap-4 overflow-x-auto">
                                {Object.entries(monthlySummary).map(([month, total]) => (
                                    <div key={month} className="bg-blue-100 rounded p-4 text-center flex-1 min-w-[120px]">
                                        <div className="font-bold">{month}</div>
                                        <div className="text-lg">₱{total.toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Revenue Insights & Category Summary */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <FiDollarSign /> Revenue & Profit by Category
                            </h2>
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-800 font-bold text-center">
                                        <th className="px-4 py-2 text-center">Category</th>
                                        <th className="px-4 py-2 text-center">Units Sold</th>
                                        <th className="px-4 py-2 text-center">Revenue</th>
                                        <th className="px-4 py-2 text-center">Profit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(categorySummary).map(([cat, data]) => (
                                        <tr key={cat} className="text-center">
                                            <td className="px-4 py-2 text-center">{cat}</td>
                                            <td className="px-4 py-2 text-center">{data.sales}</td>
                                            <td className="px-4 py-2 text-center">₱{data.revenue.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-center">₱{data.profit.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Payment Methods */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-2">Sales by Payment Methods</h2>
                            <div className="flex gap-4">
                                {Object.entries(paymentSummary).map(([method, count]) => (
                                    <div key={method} className="bg-gray-100 rounded p-4 text-center flex-1">
                                        <div className="font-bold capitalize">{method}</div>
                                        <div className="text-lg">{count} txns</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Discount Usage & Tax Breakdown */}
                        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Discount Usage</h2>
                                <div className="bg-yellow-100 rounded p-4">
                                    <div>Total Discounted Sales: {discountSummary.count}</div>
                                    <div>Total Discount Given: ₱{discountSummary.totalDiscount.toFixed(2)}</div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Tax Breakdown</h2>
                                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                                    <thead>
                                        <tr className="bg-gray-200 text-gray-800 font-bold text-center">
                                            <th className="px-4 py-2 text-center">Category</th>
                                            <th className="px-4 py-2 text-center">Total Tax</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(taxSummary).map(([cat, tax]) => (
                                            <tr key={cat} className="text-center">
                                                <td className="px-4 py-2 text-center">{cat}</td>
                                                <td className="px-4 py-2 text-center">₱{tax.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Profit Margin Reports */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-2">Profit Margin Reports</h2>
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-800 font-bold text-center">
                                        <th className="px-4 py-2 text-center">Product</th>
                                        <th className="px-4 py-2 text-center">Margin (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profitMargins.map(p => (
                                        <tr key={p.name} className="text-center">
                                            <td className="px-4 py-2 text-center">{p.name}</td>
                                            <td className="px-4 py-2 text-center">{p.margin}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Refunds and Returns */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <FiInfo /> Refunds & Returns
                                <button
                                    className="ml-2 px-2 py-1 bg-blue-200 rounded text-xs"
                                    onClick={() => setShowRefunds(!showRefunds)}
                                >
                                    {showRefunds ? "Hide" : "Show"}
                                </button>
                            </h2>
                            {showRefunds && (
                                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                                    <thead>
                                        <tr className="bg-gray-200 text-gray-800 font-bold">
                                            <th className="px-4 py-2">Customer</th>
                                            <th className="px-4 py-2">Product(s)</th>
                                            <th className="px-4 py-2">Reason</th>
                                            <th className="px-4 py-2">Cashier</th>
                                            <th className="px-4 py-2">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {refunds.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-4 text-gray-500">No refunds/returns.</td>
                                            </tr>
                                        ) : refunds.map(r => (
                                            <tr key={r.id}>
                                                <td className="px-4 py-2">{r.customer}</td>
                                                <td className="px-4 py-2">{r.products.map(p => p.name).join(', ')}</td>
                                                <td className="px-4 py-2">{r.refundReason || '-'}</td>
                                                <td className="px-4 py-2">{r.cashier}</td>
                                                <td className="px-4 py-2">{r.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Staff Performance */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <FiUsers /> Staff Performance
                            </h2>
                            <div className="flex gap-4">
                                {Object.entries(staffPerf).map(([staff, count]) => (
                                    <div key={staff} className="bg-gray-100 rounded p-4 text-center flex-1">
                                        <div className="font-bold">{staff}</div>
                                        <div className="text-lg">{count} sales</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hourly Sales Activity */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <FiClock /> Hourly Sales Activity
                                <button
                                    className="ml-2 px-2 py-1 bg-blue-200 rounded text-xs"
                                    onClick={() => setShowHourly(!showHourly)}
                                >
                                    {showHourly ? "Hide" : "Show"}
                                </button>
                            </h2>
                            {showHourly && (
                                <div className="flex gap-1 overflow-x-auto">
                                    {hourlySales.map((count, hour) => (
                                        <div key={hour} className="flex flex-col items-center min-w-[40px]">
                                            <div className="w-6 h-16 bg-blue-400 rounded-t" style={{ height: `${count * 10}px` }}></div>
                                            <div className="text-xs">{hour}:00</div>
                                            <div className="text-xs">{count}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Customer Data */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-2">Customer Data</h2>
                            <div className="mb-2">
                                <span className="font-semibold">Repeat Buyers:</span>
                                {repeatBuyers.length === 0 ? (
                                    <span className="ml-2 text-gray-500">No repeat buyers yet.</span>
                                ) : (
                                    <ul className="ml-4 list-disc">
                                        {repeatBuyers.map(c => (
                                            <li key={c.name}>
                                                {c.name} &mdash; {c.count} purchases, ₱{c.total.toFixed(2)} spent
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">High-Value Customers:</span>
                                {highValueCustomers.length === 0 ? (
                                    <span className="ml-2 text-gray-500">No data.</span>
                                ) : (
                                    <ul className="ml-4 list-disc">
                                        {highValueCustomers.map(([name, v]) => (
                                            <li key={name}>
                                                {name} &mdash; ₱{v.total.toFixed(2)} spent ({v.count} purchases)
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-4">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-800 font-bold text-center">
                                        <th className="px-4 py-2 text-center">Customer</th>
                                        <th className="px-4 py-2 text-center">Purchases</th>
                                        <th className="px-4 py-2 text-center">Total Spent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(customerTrends).map(([cust, v]) => (
                                        <tr key={cust} className="text-center">
                                            <td className="px-4 py-2">{cust}</td>
                                            <td className="px-4 py-2">{v.count}</td>
                                            <td className="px-4 py-2">₱{v.total.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Store-Wide Comparison */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-2">Store-Wide Comparison</h2>
                            <div className="flex gap-4">
                                {Object.entries(branchComparison).map(([branch, total]) => (
                                    <div key={branch} className="bg-blue-100 rounded p-4 text-center flex-1">
                                        <div className="font-bold">{branch}</div>
                                        <div className="text-lg">₱{total.toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main Sales Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-800 font-bold">
                                        <th className="px-4 py-2 border-b border-gray-300 text-left">ID</th>
                                        <th className="px-4 py-2 border-b border-gray-300 text-left">Customer</th>
                                        <th className="px-4 py-2 border-b border-gray-300 text-left">Total (₱)</th>
                                        <th className="px-4 py-2 border-b border-gray-300 text-left">Date</th>
                                        <th className="px-4 py-2 border-b border-gray-300 text-left">Items</th>
                                        <th className="px-4 py-2 border-b border-gray-300 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-6 text-gray-500">
                                                Loading sales...
                                            </td>
                                        </tr>
                                    ) : sales.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-6 text-gray-500">
                                                No sales available.
                                            </td>
                                        </tr>
                                    ) : (
                                        sales.map(sale => (
                                            <tr key={sale.id} className="hover:bg-blue-50 transition-colors">
                                                <td className="px-4 py-2 border-b border-gray-200">{sale.id}</td>
                                                <td className="px-4 py-2 border-b border-gray-200">{sale.customer}</td>
                                                <td className="px-4 py-2 border-b border-gray-200">₱{sale.total.toFixed(2)}</td>
                                                <td className="px-4 py-2 border-b border-gray-200">{sale.date}</td>
                                                <td className="px-4 py-2 border-b border-gray-200">{sale.items}</td>
                                                <td className="px-4 py-2 border-b border-gray-200">
                                                    <button
                                                        onClick={() => handleMoreDetails(sale.id)}
                                                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 flex items-center gap-1 text-sm"
                                                        title="More Details"
                                                    >
                                                        <FiInfo /> More Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SalesReports;