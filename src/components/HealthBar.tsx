import { useMemo, FC } from 'react';
import { useMeasure } from 'react-use';
import './v.css';

interface HealthBarProps {
    current: number;
    max: number;
    width?: string;
    height?: string;
    type?: 'health' | 'mp';
}

const HealthBar: FC<HealthBarProps> = ({
    current,
    max,
    type = 'health'
}) => {
    const [ref, { width: elementWidth }] = useMeasure<HTMLDivElement>();
    const percentage = useMemo(() => {
        return Math.max(0, Math.min(100, (current / max) * 100));
    }, [current, max]);
    const barColor = useMemo(() => {
        return type === "mp" ? "blue" : "red"
    }, [percentage, type]);

    return (
        <div ref={ref} className="health-bar-container w-full flex flex-col">
            <div className="mb-2 w-full">
                {/* 文字显示 */}
                <div className="text-xs w-full absolute top-0 z-4 text-center text-gray-700">
                    <b >
                        {type === 'mp' ? 'MP' : 'HP'}: {Math.min(Math.round(current), max)} / {max}
                    </b>
                </div>
                <span className="from-blue-600 from-red-600 to-blue-400 to-red-400 "></span>
                <div className="w-full bg-gray-200  rounded-full h-4 blur-1 relative overflow-hidden" style={{ backgroundColor: 'rgb(182 183 185 / 85%)' }}>
                    <div
                        className={`absolute inset-0 bg-gradient-to-r  transition-all-3000 duration-500 ease-out from-${barColor}-600 to-${barColor}-400`} style={{ width: `${(current / max) * 100}%` }}></div>
                    <div className="absolute inset-0 bg-repeat-x"
                        style={{ backgroundImage: 'url(/placeholder.svg?text=⚡&bg=transparent&fg=yellow)', backgroundSize: '20px 20px', opacity: 0.3 }}>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default HealthBar; 