import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="subtle-border p-6 relative overflow-hidden group hover:border-indigo-200 hover:shadow-md transition-all duration-300"
        >
            <div className="absolute -right-6 -top-6 text-slate-50 group-hover:text-indigo-50 transition-all duration-500 transform group-hover:scale-110">
                <Icon size={120} />
            </div>

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-slate-500 font-medium text-sm mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900">
                        {value}
                    </h3>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-indigo-500 shadow-sm">
                    <Icon size={24} />
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;
