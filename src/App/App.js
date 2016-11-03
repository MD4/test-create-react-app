import React from 'react';
import {RxComponent} from 'reactx';

const YoloService = require('./YoloService').default('my-yolo-service');

export default () => {
  const Button = require('./Button').default();

  const MyButton = Button('my-button');
  const MyButton2 = Button('my-button-2');

  return RxComponent({

    childs: {
      MyButton,
      MyButton2,
      YoloService
    },

    subStreams: {
      fetchSwag$: ($, _, rxComponent) => MyButton
        .subStreams
        .buttonClick$
        .filter(() => !rxComponent.store.swag)
        .debounce(200)
        .map(YoloService.fetchSwag),
      fetchYolo$: $ => $
        .debounce(200)
        .map(YoloService.fetchYolo)
    },

    store: {
      buttonText1: 'hey',
      buttonText2: 'ho',
      clickedSomething: false
    },

    reducer(store, event, {subStreams}) {
      switch (event.type) {
        case MyButton.events.click:
          store.buttonText1 = 'ho';
          store.buttonText2 = 'hey';

          if (store.clickedSomething) {
            subStreams.fetchYolo$.onNext(123);
          }

          store.clickedSomething = true;
          break;
        case MyButton2.events.click:
          alert('Old school shitty alert!');
          break;
        case MyButton2.events.hasDoneSomething:
          store.color = '#' + ((1 << 24) * Math.random() | 0).toString(16);
          break;
        case YoloService.events.swagFetched:
          store.swag = event.swag;
          break;
        case YoloService.events.yoloFetched:
          store.yolo = event.yolo;
          break;
        case YoloService.events.swagFetching:
          store.swag = '⌛';
          break;
        case YoloService.events.yoloFetching:
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
          <MyButton color={this.state.color} text={this.state.buttonText1}/>
          <MyButton text={this.state.buttonText2}/>
          <MyButton2 text={this.state.buttonText2}/>
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