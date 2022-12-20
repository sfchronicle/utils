// Conditionally lazyload if we want to and have the capability
const ConditionalWrapper = ({ condition, wrapper, children }) => {
    return condition ? wrapper(children) : children;
}

export default ConditionalWrapper
