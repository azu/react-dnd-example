"use strict";
const React = require("react");
import CardListContainer from "./CardListContainer/CardListContainer";
export default class App extends React.Component {
    render() {
        return <div className="App">
            <CardListContainer />
        </div>;
    }
}