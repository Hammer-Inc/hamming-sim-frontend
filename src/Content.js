import React, {Component} from "react/cjs/react.production.min";
import PropTypes from "prop-types";
import {Card, CardHeader, CardText, GridList} from "material-ui";
import {sortbyposition} from "./Logic/API";
import ParityInfo from "./Components/ParityInfo";
import Sheet from "./Components/Sheets/Sheet";

const styles = {
    parent: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'auto',
    },
};

export default class Content extends Component {
    static propTypes = {
        information: PropTypes.object.isRequired,
    };


    constructor(props) {
        super(props);
        this.state = {
            infoTarget: undefined,
            highlight: []
        };
    }

    setInfoTarget = (bit) => {
        if (this.state.infoTarget !== undefined) {
            if (bit.position === this.state.infoTarget.position) {
                this.setState({
                    infoTarget: undefined
                });
                return null
            }
        }
        this.setState({
            infoTarget: bit
        })
    };

    resetHighlight = () => this.setState({highlight:[]});

    setHighlightFromParity = (bit) => {
        let result = [bit.position];
        if (bit.hasOwnProperty('components')) {
            for (let v in bit.components) {
                result.append(this.props.information.message[v.index].position);
            }
        }
        this.setState({
            highlight: result
        });

    };

    render() {
        let highlight = this.state.highlight;
        let target = this.state.infoTarget;
        let hasElements = this.props.information.message.length !== 0;
        const highlightStyle = {
            borderColor: 'yellow'
        };
        const isHighlighted = (bit) => {
            if (this.state.highlight.includes(bit.position)) {
                return true
            }
        };
        let elements = this.props.information.parity.concat(this.props.information.message).sort(sortbyposition).reverse();
        const elementsAsGrid = (e) => e.map((bit) => {
                let is_parity = bit.hasOwnProperty("components");
                let colour = is_parity ? 'rgb(200,0,0)' : 'rgb(0,200,200)';
                return (
                    <Sheet identifier={bit.position} value={bit.value} index={bit.position}
                           header={(is_parity ? "P" : "D") + bit.index}
                           onClick={() => {
                               if(is_parity) {
                                   if(this.state.infoTarget.position === bit.position){
                                       this.resetHighlight()
                                   }else {
                                       this.setHighlightFromParity(bit)
                                   }
                               }
                               this.setInfoTarget(bit)

                           }}
                           title={is_parity ? "Parity" : "Data"}
                           highlight={() => {
                               if (isHighlighted(bit)) {
                                   return {
                                       type: "Component",
                                       style: highlightStyle
                                   }

                               }
                           }}
                           cardStyle={{color: colour}}
                           headerStyle={{borderColor: colour, backgroundColor: colour}}
                           indexStyle={{color: colour}}
                           overlayStyle={colour}

                    />
                )
            }
        );
        const sample = () => [0, 1, 2, 3, 4, 5].map((x) => {
            return (
                <Sheet identifier={'sample-0'} value={x % 2} index={x} header={"s" + x} onClick={() => {
                }} title={"Sample"}/>
            )
        });
        return (
            <div style={{display: 'block'}}>
                <div style={{textAlign: 'left'}}>
                    <Card
                        expandable={true}
                        initiallyExpanded={true}
                    >
                        <CardHeader
                            title={"Viewing results"}
                            subtitle={"Tutorial"}
                            actAsExpander={true}
                            showExpandableButton={true}
                        />

                        <CardText
                            expandable={true}
                        >
                            <p>
                                Once you enter some data in the 'settings' sidebar menu and click validate you will see
                                a series of cards below. Each card represents a binary value you entered or a parity bit
                                calculated for the information entered.
                            </p>
                            <p style={{display: !hasElements ? 'none' : 'inherit'}}>
                            </p>
                        </CardText>
                    </Card>
                    <Card>
                        <CardHeader
                            title={'Result:'}
                        />
                        <CardText>
                            <GridList
                                style={styles.gridList}
                                cols={'2.2'}>
                                {hasElements ? elementsAsGrid(elements) : sample()}
                            </GridList>
                        </CardText>
                        {target !== undefined ? (
                            <CardHeader
                                title={"More Information"}
                                subtitle={"For bit at position " + target.position}
                            />
                        ) : null}

                        {target !== undefined? (
                            <ParityInfo
                                source={target}
                            />
                        ) : null}
                    </Card>
                </div>
            </div>
        );
    }
}