import { StylesConfig, GroupBase } from 'react-select';

export const themeStyles: StylesConfig<any, boolean, GroupBase<any>> = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: 'hsl(var(--background))',
        borderColor: state.isFocused 
            ? 'hsl(var(--ring))' 
            : 'hsl(var(--border))',
        borderRadius: 'calc(var(--radius) - 2px)',
        borderWidth: '1px',
        boxShadow: state.isFocused 
            ? '0 0 0 2px hsl(var(--ring))' 
            : 'none',
        minHeight: '2rem',
        fontSize: '0.875rem',
        '&:hover': {
            borderColor: 'hsl(var(--border))',
        },
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: '0.25rem 0.75rem',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'hsl(var(--muted-foreground))',
    }),
    input: (provided) => ({
        ...provided,
        color: 'hsl(var(--foreground))',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'hsl(var(--foreground))',
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: 'hsl(var(--secondary))',
        borderRadius: 'calc(var(--radius) - 4px)',
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: 'hsl(var(--secondary-foreground))',
        fontSize: '0.75rem',
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: 'hsl(var(--secondary-foreground))',
        ':hover': {
            backgroundColor: 'hsl(var(--destructive))',
            color: 'hsl(var(--destructive-foreground))',
        },
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: 'hsl(var(--popover))',
        border: '1px solid hsl(var(--border))',
        borderRadius: 'calc(var(--radius) - 2px)',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        zIndex: 50,
    }),
    menuList: (provided) => ({
        ...provided,
        padding: '0.25rem',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? 'hsl(var(--accent))'
            : state.isFocused
                ? 'hsl(var(--accent))'
                : 'transparent',
        color: state.isSelected || state.isFocused
            ? 'hsl(var(--accent-foreground))'
            : 'hsl(var(--popover-foreground))',
        borderRadius: 'calc(var(--radius) - 4px)',
        margin: '0.125rem 0',
        fontSize: '0.875rem',
        ':active': {
            backgroundColor: 'hsl(var(--accent))',
        },
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: 'hsl(var(--muted-foreground))',
        ':hover': {
            color: 'hsl(var(--foreground))',
        },
    }),
    clearIndicator: (provided) => ({
        ...provided,
        color: 'hsl(var(--muted-foreground))',
        ':hover': {
            color: 'hsl(var(--foreground))',
        },
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        backgroundColor: 'hsl(var(--border))',
    }),
    loadingIndicator: (provided) => ({
        ...provided,
        color: 'hsl(var(--muted-foreground))',
    }),
}