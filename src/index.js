import QueryEmitter, { where, query } from './query-emitter'
import Store from './store'

const store = new Store()
const queryEmitter = new QueryEmitter(store)

store.on('change', (_, type, id, prevDocument, document) => {
  queryEmitter.emit(type, id, prevDocument, document)
})

store.setDocument(
  'player',
  'james',
  {
    mapId: '123abc',
    position: {
      x: 50,
      y: 50,
    },
  },
)

const playerQuery = query('player', where(['mapId'], '==', '123abc'))

// If instead of storing them as an array, they were stored as a map.
// Then we can easily add and remove elements.
// Then we just return it with Object.values().
let players = {}

const onPlayerChange = (type, id, prevDocument, document) => {
  if (document) {
    players[id] = document
  } else {
    delete players[id]
  }
}

players = queryEmitter.on(playerQuery, onPlayerChange)

store.setDocument(
  'player',
  'james',
  null,
)
