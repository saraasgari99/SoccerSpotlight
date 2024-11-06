import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../assets/timeplot.css';
import moment from 'moment';

const config = require('../config.json');

const numberParser = (params) => {
  const value = params.newValue;
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return parseFloat(value);
};

const chartTooltipRenderer = ({ xValue, yValue }) => {
  xValue = xValue instanceof Date ? xValue : new Date(xValue);
  return {
    content: `${moment(xValue).format('DD MMM')}: ${yValue}`,
  };
};

export default function Timeplot({ player_api_id }) {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: '60%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([
    {
      field: 'date',
      chartDataType: 'time',
      valueFormatter: (params) => params.value.toISOString().substring(0, 10),
    },
    { field: 'overall_rating', chartDataType: 'series', valueParser: numberParser },
    { field: 'potential', chartDataType: 'series', valueParser: numberParser },
  ]);
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/get_player_attributes_by_id/${player_api_id}`)
      .then(res => res.json())
      .then(resJson => {
        let temp = resJson;
        temp.map((player) => {
          player.date = new Date(player.date);
        });
        setRowData(temp);
        
      });
  }, []);
  console.log(rowData);
  console.log('id:', player_api_id);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      editable: true,
      sortable: true,
      filter: true,
      resizable: true,
    };
  }, []);
  const chartThemes = useMemo(() => {
    return ['ag-pastel', 'ag-vivid'];
  }, []);
  const popupParent = useMemo(() => {
    return document.body;
  }, []);
  const chartThemeOverrides = useMemo(() => {
    return {
      common: {
        padding: {
          top: 45,
        },
        legend: {
          position: 'bottom',
        },
        axes: {
          number: {
            title: {
              enabled: true,
            },
          },
        },
      },
      column: {
        series: {
          strokeWidth: 2,
          fillOpacity: 0.8,
          tooltip: {
            renderer: chartTooltipRenderer,
          },
        },
      },
      line: {
        series: {
          strokeWidth: 5,
          strokeOpacity: 0.8,
          tooltip: {
            renderer: chartTooltipRenderer,
          },
        },
      },
    };
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    gridRef.current.api.createRangeChart({
      chartType: 'customCombo',
      cellRange: {
        columns: ['date', 'overall_rating', 'potential'],
      },
      seriesChartTypes: [
        // { colId: 'rain', chartType: 'groupedColumn', secondaryAxis: false },
        { colId: 'overall_rating', chartType: 'line', secondaryAxis: true },
        { colId: 'potential', chartType: 'line', secondaryAxis: true },
      ],
      aggFunc: 'sum',
      suppressChartRanges: true,
      chartContainer: document.querySelector('#myChart'),
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="wrapper">
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            enableRangeSelection={true}
            chartThemes={chartThemes}
            enableCharts={true}
            popupParent={popupParent}
            chartThemeOverrides={chartThemeOverrides}
            onFirstDataRendered={onFirstDataRendered}
          ></AgGridReact>
        </div>
        <div id="myChart" className="ag-theme-alpine"></div>
      </div>
    </div>
  );
};