import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

class MultiSelect extends React.Component {
    constructor(props) {
        super(props);
        this.orderOptions = Object.entries(this.props.options)
            .map(([key, value]) => ({
                label: key,
                value
            }));
    }

    onChange = selected => {
        this.props.updateSelected(selected);
    };

    render() {
        return (
            <Select
                closeMenuOnSelect={false}
                isMulti
                options={this.orderOptions}
                onChange={this.onChange}
            />
        );
    }
}

MultiSelect.propTypes = {
    options: PropTypes.object,
    updateSelected: PropTypes.func
};

export default MultiSelect;
