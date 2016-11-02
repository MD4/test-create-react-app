import React from 'react';
import {Observable, Subject} from 'rx';

const fakeFetch = (data) => new Promise(
  resolve => setTimeout(resolve, 1000, data)
);

const fetchYolo$ = new Subject();
const fetchSwag$ = new Subject();

const events = {
  yoloFetching: {type: 'yolo-fetching'},
  swagFetching: {type: 'swag-fetching'},
  yoloFetched: {type: 'yolo-fetched'},
  swagFetched: {type: 'swag-fetched'}
};

const subStreams = {
  fetchYoloProcess$: fetchYolo$
    .flatMap(
      () => Observable
        .fromPromise(fakeFetch({yolo: `Y0L0-$W4G ${(Math.random() * 100) << 0}%`}))
        .map(event => (event.type = events.yoloFetched) && event)
    ),
  fetchSwagProcess$: fetchSwag$
    .flatMap(
      () => Observable
        .fromPromise(fakeFetch({swag: `${(Math.random() * 10000) << 0}$`}))
        .map(event => (event.type = events.swagFetched) && event)
    )
};

export default {

  subStreams,
  events,

  stream$: Observable
    .of(...Object.values(subStreams))
    .mergeAll()
    .share(),

  fetchYolo: () => {
    fetchYolo$.onNext();
    return events.yoloFetching;
  },

  fetchSwag: () => {
    console.log('lilolol')
    fetchSwag$.onNext();
    return events.swagFetching;
  },

};