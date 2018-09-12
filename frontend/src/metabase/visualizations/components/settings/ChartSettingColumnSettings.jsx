import React from "react";

import {
  fieldRefForColumn,
  findColumnForColumnSetting,
  keyForColumn,
} from "metabase/lib/dataset";

import ChartSettingsWidget from "../ChartSettingsWidget";
import { getSettingsWidgetsForColumm } from "metabase/visualizations/lib/settings/column";

import Icon from "metabase/components/Icon";

import { t } from "c-3po";
import _ from "underscore";

const displayNameForColumn = column =>
  column ? column.display_name || column.name : "[Unknown]";

export default class ChartSettingColumnSettings extends React.Component {
  state = {
    editingColumn: null,
  };

  handleChange = newSettings => {
    const { onChange } = this.props;
    const { editingColumn } = this.state;

    const columnKey = keyForColumn(editingColumn);
    const columnsSettings = this.props.value || {};
    const columnSettings = columnsSettings[columnKey] || {};
    onChange({
      ...columnsSettings,
      [columnKey]: {
        ...columnSettings,
        ...newSettings,
      },
    });
  };

  render() {
    const { columns } = this.props;
    const { editingColumn } = this.state;

    if (editingColumn) {
      const columnKey = keyForColumn(editingColumn);
      const columnsSettings = this.props.value || {};
      const columnSettings = columnsSettings[columnKey] || {};
      return (
        <div>
          <div
            className="flex align-center mb2 cursor-pointer"
            onClick={() => this.setState({ editingColumn: null })}
          >
            <Icon name="chevronleft" className="text-light" />
            <span className="ml1 text-bold text-brand">
              {displayNameForColumn(editingColumn)}
            </span>
          </div>
          {getSettingsWidgetsForColumm(
            editingColumn,
            columnSettings,
            this.handleChange,
          ).map(widget => (
            <ChartSettingsWidget key={`${widget.id}`} {...widget} />
          ))}
          <div>DEBUG:</div>
          <textarea
            value={JSON.stringify(columnSettings)}
            onChange={e => this.handleChange(JSON.parse(e.target.value))}
          />
        </div>
      );
    } else {
      return (
        <div>
          {columns.map(column => (
            <div
              className="bordered rounded p1 mb1"
              onClick={() => this.setState({ editingColumn: column })}
            >
              {displayNameForColumn(column)}
            </div>
          ))}
        </div>
      );
    }
  }
}
