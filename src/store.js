import EventEmitter from 'events'

class Store extends EventEmitter {
  collections = {}

  setDocument(type, id, document, source = 'local') {
    if (this.collections[type] === undefined) {
      if (document === null) {
        return
      }

      this.collections[type] = {
        [id]: document,
      }

      this.emit('change', source, type, id, null, document)
      return
    }

    const prevDocument = this.collections[type][id]

    if (document === null) {
      delete this.collections[type][id]
    } else {
      this.collections[type][id] = document
    }

    this.emit('change', source, type, id, prevDocument, document)
  }

  getDocument(type, id) {
    return this.collections[type]?.[id] ?? null
  }

  getDocuments(type) {
    return Object.values(this.collections[type] ?? {})
  }

  hasDocument(type, id) {
    return this.collections[type]?.[id] !== undefined
  }

  getIds(type) {
    return Object.keys(this.collections[type] ?? {})
  }
}

export default Store
