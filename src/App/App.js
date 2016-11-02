import React from 'react';
import {RxComponent} from 'reactx';

import YoloService from './YoloService';

export default () => {
  const Button = require('./Button').default();

  return RxComponent({

    childs: {
      myButton: Button('my-button'),
      myButton2: Button('my-button-2')
    },

    subStreams$: {
      yoloService$: $ => YoloService.stream$,
      fetchSwag$: $ => $
        .debounce(500)
        .map(YoloService.fetchSwag),
      fetchYolo$: $ => $
        .debounce(500)
        .map(YoloService.fetchYolo)
    },

    store: {
      buttonText1: 'hey',
      buttonText2: 'ho',
      clickedSomething: false
    },

    yoloFetchingRule() {
      return true;
    },

    reducer(store, event) {
      switch (event.type) {
        case this.childs.myButton.events.click:
          store.buttonText1 = 'ho';
          store.buttonText2 = 'hey';

          if (store.clickedSomething ) {
            this.subStreams$.fetchYolo$.onNext();
          } else {
            this.subStreams$.fetchSwag$.onNext();
          }

          store.clickedSomething = true;
          break;
        case this.childs.myButton2.events.click:
          alert('Old school shitty alert!');
          break;
        case this.childs.myButton2.events.hasDoneSomething:
          store.color = '#' + ((1 << 24) * Math.random() | 0).toString(16);
          break;
        case YoloService.events.swagFetched:
          store.swag = event.swag;
          break;
        case YoloService.events.yoloFetched:
          store.yolo = event.yolo;
          break;
        case YoloService.events.swagFetching.type:
          store.swag = '⌛';
          break;
        case YoloService.events.yoloFetching.type:
          store.yolo = '⌛';
          break;
        default:
      }
      return store;
    },

    render() {
      return (
        <div className="App">
          <h1>App</h1>
          <p>lol</p>
          <this.childs.myButton color={this.state.color} text={this.state.buttonText1}></this.childs.myButton>
          <this.childs.myButton text={this.state.buttonText2}></this.childs.myButton>
          <this.childs.myButton2 text={this.state.buttonText2}></this.childs.myButton2>
          <p>
            SWAG:{this.state.swag}
          </p>
          <p>
            YOLO:{this.state.yolo}
          </p>
        </div>
      );
    }

  });
}