// Example query:
// query('person', where(['position', 'x'], '>', 18))
// Operators:
// >, >=, <, <=, ==, !=

export const where = (path, operator, value) => {
  let condition

  switch (operator) {
    case '>':
      condition = (item) => item > value
      break
    case '>=':
      condition = (item) => item >= value
      break
    case '<':
      condition = (item) => item < value
      break
    case '<=':
      condition = (item) => item <= value
      break
    case '==':
      condition = (item) => item == value
      break
    case '!=':
      condition = (item) => item != value
      break
    default:
      return false
  }

  return (document) => {
    let currentDocument = document
    for (let i = 0; i < path.length; i++) {
      currentDocument = currentDocument[path[i]]
      if (currentDocument === undefined) {
        return false
      }
    }

    return condition(currentDocument)
  }
}

export const query = (type, where) => {
  const onQuery = (store) => {
    const documentIds = store.getIds(type)
    const documents = {}

    for (let i = 0; i < documentIds.length; i++) {
      const id = documentIds[i]
      const document = store.getDocument(type, id)

      if (where(document)) {
        documents[id] = document
      }
    }

    return documents
  }

  const onChange = (docType, prevDocument, document) => {
    if (type !== docType) {
      return false
    }

    return where(prevDocument) || where(document)
  }

  return {
    onQuery,
    onChange,
  }
}

class QueryEmitter {
  queries = new Map()

  constructor(store) {
    this.store = store
  }

  // Get me the current state of the world that matches my query.
  // Then trigger an event whenever the data changes.
  on(query, callback) {
    this.queries.set(callback, query.onChange)
    return query.onQuery(this.store)
  }

  off(callback) {
    this.queries.delete(callback)
  }

  emit(type, id, prevDocument, document) {
    for (let [callback, query] of this.queries) {
      if (query(type, prevDocument, document)) {
        callback(type, id, prevDocument, document)
      }
    }
  }
}

export default QueryEmitter
