import React from 'react';
import PropTypes from 'prop-types';


import Select from '../select/select';
import replaceAll from '../../../lib/replaceAll';

import css from './filter.css';

const filterTypes = {
    Enum: 'Enum',
    Date: 'Date',
    DateTime: 'DateTime',
    Int: 'Int',
    Array: 'Array',
    Str: 'Str'
};

class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.parseType();
        this.ref1 = React.createRef();
        this.ref2 = React.createRef();
    }

    parseType = () => {
        const { rawType: s } = this.props;

        if (s.startsWith(filterTypes.Enum)) {
            this.type = filterTypes.Enum;
            let variants = s.slice(s.indexOf('(') + 1, -1);
            variants = replaceAll(variants, '\'', '');
            variants = replaceAll(variants, ' ', '');
            variants = variants.split(',');
            this.variants = {};
            variants.forEach(str => {
                const [key, value] = str.split('=');
                this.variants[key] = value;
            });
        } else if (s === filterTypes.Date) {
            this.type = filterTypes.Date;
        } else if (s === filterTypes.DateTime) {
            this.type = filterTypes.DateTime;
        } else if (s.startsWith('Int') || s.startsWith('UInt')) {
            this.type = filterTypes.Int;
        } else if (s.startsWith('Array')) {
            this.type = filterTypes.Array;
        } else {
            this.type = filterTypes.Str;
        }
    };

    calculateWhere = event => {
        const { fieldName } = this.props;

        switch (this.type) {
            case filterTypes.Enum: {
                if (event === null) {
                    return '';
                }
                const where = event.map(variant => {
                    return `${fieldName} = ${variant.label}`;
                })
                    .join(' or ');

                return `(${where})`;
            }
            case filterTypes.Date:
            case filterTypes.DateTime: {
                if (!this.ref1.current) {
                    return '';
                }
                const value = this.ref1.current.value.replace('T', ' ');

                return `${fieldName} = '${value}'`;
            }
            case filterTypes.Int: {
                if (!this.ref1.current || !this.ref2.current) {
                    return '';
                }
                const results = [];
                const value1 = this.ref1.current.value;
                const value2 = this.ref2.current.value;
                if (value1 !== '') {
                    const number = parseInt(value1);
                    results.push(`${fieldName} >= ${number}`);
                }
                if (value2 !== '') {
                    const number = parseInt(value2);
                    results.push(`${fieldName} <= ${number}`);
                }

                return results.join(' and ');
            }
            case filterTypes.Array: {
                const value = this.ref1.current.value;

                return `has(${fieldName}, ${value})`;
            }
            default: {
                const value = this.ref1.current.value;

                return `${fieldName} = ${value}`;
            }
        }
    };

    onChange = event => {
        const { fieldName, updateWhere } = this.props;
        const filter = {
            [fieldName]: this.calculateWhere(event)
        };
        updateWhere(filter);
    };

    render() {
        switch (this.type) {
            case filterTypes.Enum:
                return (
                    <Select
                        options={this.variants}
                        updateSelected={this.onChange}
                    />
                );
            case filterTypes.Date:
                return (
                    <input
                        type="date"
                        onChange={this.onChange}
                        ref={this.ref1}
                    />
                );
            case filterTypes.DateTime:
                return (
                    <input
                        type="datetime-local"
                        step="1"
                        onChange={this.onChange}
                        ref={this.ref1}
                    />
                );
            case filterTypes.Int:
                return (
                    <>
                        <input
                            type="number"
                            placeholder="min"
                            className={css.number1}
                            id="number1"
                            onChange={this.onChange}
                            ref={this.ref1}
                        />
                        <input
                            type="number"
                            placeholder="max"
                            onChange={this.onChange}
                            ref={this.ref2}
                        />
                    </>
                );
            default:
                return (
                    <input
                        onChange={this.onChange}
                        ref={this.ref1}
                    />
                );
        }
    }
}

Filter.propTypes = {
    rawType: PropTypes.string.isRequired,
    updateWhere: PropTypes.func,
    fieldName: PropTypes.string
};

export default Filter;
