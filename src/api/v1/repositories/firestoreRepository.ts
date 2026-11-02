// Creates a document, returns the created data with ID
createDocument<T>(collectionName: string, data: T): Promise<T & { id: string }>

// Gets all documents in a collection
getAllDocuments<T>(collectionName: string): Promise<T[]>

// Gets a document by ID, returns null if not found
getDocumentById<T>(collectionName: string, id: string): Promise<T | null>

// Updates a document, returns updated data
updateDocument<T>(collectionName: string, id: string, data: Partial<T>): Promise<T>

// Deletes a document
deleteDocument(collectionName: string, id: string): Promise<void>