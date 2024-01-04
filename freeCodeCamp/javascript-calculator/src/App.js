import React from 'react';
import "./App.css";
import {createStore} from "redux";
import {Provider, connect} from "react-redux";

// these contants acts as button type and action type

const DIGIT = "DIGIT";
const OPERATOR = "OPERATOR";
const DECIMAL = "DECIMAL";
const EQUALS= "EQUALS";
const CLEAR = "CLEAR";
const REMOVE = "REMOVE";

const buttonsData = [
    {
    id: "zero",
    symbol: "0",
    type: DIGIT
},
    {
    id: "one",
    symbol: "1",
    type: DIGIT
},
    {
    id: "two",
    symbol: "2",
    type: DIGIT
},
    {
    id: "three",
    symbol: "3",
    type: DIGIT
},
    {
    id: "four",
    symbol: "4",
    type: DIGIT
},
    {
    id: "five",
    symbol: "5",
    type: DIGIT
},
    {
    id: "six",
    symbol: "6",
    type: DIGIT
},
    {
    id: "seven",
    symbol: "7",
    type: DIGIT
},
    {
    id: "eight",
    symbol: "8",
    type: DIGIT
},
    {
    id: "nine",
    symbol: "9",
    type: DIGIT
},
    {
    id: "add",
    symbol: "+",
    type: OPERATOR
},
    {
    id: "subtract",
    symbol: "-",
    type: OPERATOR
},
    {
    id: "multiply",
    symbol: "*",
    type: OPERATOR
},
    {
    id: "divide",
    symbol: "/",
    type: OPERATOR
},
    {
    id: "clear",
    symbol: "AC",
    type: CLEAR
},
    {
    id: "equals",
    symbol: "=",
    type: EQUALS
},
    {
    id: "decimal",
    symbol: ".",
    type: DECIMAL
},
    {
    id: "last",
    symbol: "ᗕ",
    type: REMOVE
}
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.store = createStore(reducer);
    }
    render() {
        
        const AppDisplay = connect( ({display}) => ({display}) )(Display);
        const AppCalculatorButton = connect(null, dispatch => ({perform: (action) => dispatch(action) }))(CalculatorButton);
        return (
<Provider store={this.store}>
    <div>
        <main>
            <div className="container">
                <AppDisplay id="display" className="display" />
                <div className="buttonContainer">
                    {buttonsData.map((data) => <AppCalculatorButton key={data.id} data={data} />)}
                </div>
            </div>
        </main>
    </div>
</Provider>
        );
    }
}

const Display = ({display, id}) => (<div className="display" id={id} >{display}</div>);

const CalculatorButton = ({data, perform})=> {
    return <div className={`calculator-button ${data.type}`} id={data.id} style={{gridArea: data.id}}  onClick={event => perform({type: data.type, symbol: data.symbol})} >{data.symbol}
    </div>
}

const canAddDecimal = display => {
    for (let i = display.length - 1; i >= 0; i--) {
        if (display[i] == ".") {
            return false;
        } else if("+-/*".includes(display[i])){
            return true;
        }
    }
    return true;
}
const evaluate = exp => {
    let result = "";
    const OPERATORS = "+-/*";
    const OPERATORS_WITHOUT_MINUS = "+/*";
    for (let i = exp.length - 1; i >= 0; i--) {
        if (
            !OPERATORS.includes(exp[i])
            || !OPERATORS_WITHOUT_MINUS.includes(result[0])
            ) {
            result = exp[i] + result;
        }
    }
    return eval(result) + "";
}
const initialState = {
    display: "0"
};
const reducer = (state = initialState, {type, symbol} ) => {
    let display = state.display;
    switch (type) {
        case CLEAR:
            return Object.assign({}, state, initialState);
            break;
        case DIGIT:
            if (display == "0") {
                display = symbol;
            } else {
                display += symbol;
            }
            break;
        case OPERATOR:
            if (display.slice(-1) != ".") {
                display += symbol;
            }
            break;
            case EQUALS:
                display = evaluate(display);
                break;
        case DECIMAL:
            if (canAddDecimal(display)) {
                display += symbol;
            }
            break;
            case REMOVE:
                if (display.length > 1) {
                    display = display.slice(0, -1);
                } else {
                    display = "0";
                }
                break;
        default:
            return state;
    }
    if (state.display != display) {
    return Object.assign({}, state, {display});
    }
    return state;
}


export default App;