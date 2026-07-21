import { Pie, Doughnut, Line, Bar } from 'react-chartjs-2';
import './registerCharts';
import { CHART_PALETTE } from '../../utils/constants';
import { useSettings } from '../../context/SettingsContext';
import { formatCurrency } from '../../utils/formatters';

function useChartTheme() {
  const { settings } = useSettings();
  const dark = settings.theme === 'dark';
  return {
    grid: dark ? 'rgba(255,255,255,0.06)' : 'rgba(16,18,24,0.06)',
    text: dark ? '#c2c8d4' : '#525968',
    tooltipBg: dark ? '#1a1d24' : '#ffffff',
    tooltipBorder: dark ? '#2a2e38' : '#eef0f4',
  };
}

function tooltipCurrency(label) {
  const { settings } = useSettings();
  return (ctx) => {
    const v = ctx.raw;
    return `${label || ctx.dataset.label || ''}: ${formatCurrency(v, settings.currency, { withSymbol: true })}`;
  };
}

export function IncomeExpenseLine({ data, height = 260 }) {
  const t = useChartTheme();
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: 'Income',
        data: data.map((d) => d.income),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.12)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Expense',
        data: data.map((d) => d.expense),
        borderColor: '#3366ff',
        backgroundColor: 'rgba(51,102,255,0.12)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', align: 'end', labels: { usePointStyle: true, color: t.text, font: { size: 12 } } },
      tooltip: { backgroundColor: t.tooltipBg, borderColor: t.tooltipBorder, borderWidth: 1, padding: 10, callbacks: { label: tooltipCurrency() } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: t.text, font: { size: 11 } } },
      y: { grid: { color: t.grid }, ticks: { color: t.text, font: { size: 11 }, callback: (v) => formatCurrency(v, 'INR', { compact: true }) } },
    },
  };
  return <div style={{ height }}><Line data={chartData} options={options} /></div>;
}

export function CategoryDoughnut({ data, height = 260 }) {
  const t = useChartTheme();
  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.amount),
        backgroundColor: CHART_PALETTE,
        borderWidth: 2,
        borderColor: t.tooltipBg,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: { position: 'right', labels: { usePointStyle: true, color: t.text, font: { size: 11 }, padding: 12 } },
      tooltip: { backgroundColor: t.tooltipBg, borderColor: t.tooltipBorder, borderWidth: 1, padding: 10, callbacks: { label: tooltipCurrency() } },
    },
  };
  return <div style={{ height }}><Doughnut data={chartData} options={options} /></div>;
}

export function CategoryPie({ data, height = 260 }) {
  const t = useChartTheme();
  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [{ data: data.map((d) => d.amount), backgroundColor: CHART_PALETTE, borderWidth: 2, borderColor: t.tooltipBg }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { usePointStyle: true, color: t.text, font: { size: 11 }, padding: 12 } },
      tooltip: { backgroundColor: t.tooltipBg, borderColor: t.tooltipBorder, borderWidth: 1, padding: 10, callbacks: { label: tooltipCurrency() } },
    },
  };
  return <div style={{ height }}><Pie data={chartData} options={options} /></div>;
}

export function WeeklyBar({ data, height = 260 }) {
  const t = useChartTheme();
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      { label: 'Income', data: data.map((d) => d.income), backgroundColor: '#10b981', borderRadius: 6, barPercentage: 0.6 },
      { label: 'Expense', data: data.map((d) => d.expense), backgroundColor: '#3366ff', borderRadius: 6, barPercentage: 0.6 },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', align: 'end', labels: { usePointStyle: true, color: t.text, font: { size: 12 } } },
      tooltip: { backgroundColor: t.tooltipBg, borderColor: t.tooltipBorder, borderWidth: 1, padding: 10, callbacks: { label: tooltipCurrency() } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: t.text, font: { size: 11 } } },
      y: { grid: { color: t.grid }, ticks: { color: t.text, font: { size: 11 }, callback: (v) => formatCurrency(v, 'INR', { compact: true }) } },
    },
  };
  return <div style={{ height }}><Bar data={chartData} options={options} /></div>;
}

export function YearlyBar({ data, height = 260 }) {
  const t = useChartTheme();
  const chartData = {
    labels: data.map((d) => d.year),
    datasets: [
      { label: 'Income', data: data.map((d) => d.income), backgroundColor: '#10b981', borderRadius: 6, barPercentage: 0.5 },
      { label: 'Expense', data: data.map((d) => d.expense), backgroundColor: '#3366ff', borderRadius: 6, barPercentage: 0.5 },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', align: 'end', labels: { usePointStyle: true, color: t.text, font: { size: 12 } } },
      tooltip: { backgroundColor: t.tooltipBg, borderColor: t.tooltipBorder, borderWidth: 1, padding: 10, callbacks: { label: tooltipCurrency() } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: t.text, font: { size: 11 } } },
      y: { grid: { color: t.grid }, ticks: { color: t.text, font: { size: 11 }, callback: (v) => formatCurrency(v, 'INR', { compact: true }) } },
    },
  };
  return <div style={{ height }}><Bar data={chartData} options={options} /></div>;
}
