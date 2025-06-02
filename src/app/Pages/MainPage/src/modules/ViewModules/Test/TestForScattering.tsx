import React, { useState, useEffect } from 'react';

import dynamic from 'next/dynamic';

// 动态导入 Plotly，关闭 SSR
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function ConstellationDiagram({ iqData }) {
    const x = iqData.map(point => point.i);
    const y = iqData.map(point => point.q);

    return (
        <Plot
            data={[
                {
                    x,
                    y,
                    mode: 'markers',
                    marker: { color: '#10b981', size: 8 },
                    type: 'scatter'
                }
            ]}
            layout={{
                title:{
                    subtitle: 'Constellation Diagram',
                    font: { color: '#f9fafb' },
                    x: 0.5,
                    xanchor: 'center',
                    y: 0.95,
                    yanchor: 'top'
                },
                xaxis: { title: {
                    text: 'I',
                    font: { color: '#f9fafb' }
                }, range: [-2, 2], zeroline: true },
                yaxis: { title:{
                    text: 'Q',
                    font: { color: '#f9fafb' }
                }, range: [-2, 2], zeroline: true },
                paper_bgcolor: '#1f2937',
                plot_bgcolor: '#1f2937',
                width: 500,
                height: 500
            }}
        />
    );
}
