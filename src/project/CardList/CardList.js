'use strict';
import React from 'react';
import CardItem from './CardItem/CardItem';
import DnDCardItemWrapper from './CardItem/DnDCardItemWrapper';
import PreviewCardItem from './PreviewCardItem/PreviewCardItem';
export default class VideoCardList extends React.Component {
    static propTypes = {
        cardSize: React.PropTypes.shape({
            width: React.PropTypes.number.isRequired,
            height: React.PropTypes.number.isRequired
        }),
        items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        onSwap: React.PropTypes.func
    };

    render() {
        const items = this.props.items.map((item, index) => {
            return <DnDCardItemWrapper>
                <CardItem
                    key={item.id}
                    index={index}
                    id={item.id}
                    title={item.title}
                    thumbnailURL={item.thumbnailURL}
                    onSwap={this.props.onSwap}
                    cardSize={this.props.cardSize}
                />
            </DnDCardItemWrapper>;
        });
        return (
            <div className="CardList">
                <PreviewCardItem cardSize={this.props.cardSize}/>
                {items}
            </div>
        );
    }
}
