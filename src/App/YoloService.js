import React from 'react';
import {Observable} from 'rx';
import {RxService} from 'reactx';

const fakeFetch = (data) => new Promise(
  resolve => setTimeout(resolve, 1000, data)
);

export default RxService({

  events: {
    yoloFetching: 'yolo-fetching',
    swagFetching: 'swag-fetching',
    yoloFetched: 'yolo-fetched',
    swagFetched: 'swag-fetched'
  },

  subStreams: {
    fetchYolo$: ($, _, {events}) => $.map({type: events.yoloFetching}),
    fetchSwag$: ($, _, {events}) => $.map({type: events.swagFetching}),

    fetchYoloProcess$: ($, _, {subStreams: {fetchYolo$}, events}) => fetchYolo$
      .flatMap(
        () => Observable
          .fromPromise(fakeFetch({yolo: `Y0L0-$W4G ${(Math.random() * 100) << 0}%`}))
      )
      .map(event => (event.type = events.yoloFetched) && event),

    fetchSwagProcess$: ($, _, {subStreams: {fetchSwag$}, events}) => fetchSwag$
      .flatMap(
        () => Observable
          .fromPromise(fakeFetch({swag: `${(Math.random() * 10000) << 0}$`}))
      )
      .map(event => (event.type = events.swagFetched) && event)
  },

  exposes: ({subStreams, events}) => ({

    fetchYolo() {
      subStreams.fetchYolo$.onNext();
    },

    fetchSwag() {
      subStreams.fetchSwag$.onNext();
    }

  })

});