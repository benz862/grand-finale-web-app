import { supabase } from './supabase';

export interface IDDocument {
  id?: string;
  user_id?: string;
  document_type: 'nationalId' | 'passport' | 'driverLicense' | 'greenCard' | 'immigrationDoc';
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  file_url?: string;
  upload_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UploadedIDDocument extends IDDocument {
  id: string;
  file_url: string;
  upload_date: string;
  created_at: string;
  updated_at: string;
}

/**
 * Upload an ID document to Supabase Storage and save metadata to database
 */
export const uploadIDDocument = async (
  file: File,
  documentType: IDDocument['document_type'],
  userId: string
): Promise<UploadedIDDocument> => {
  try {
    // Generate unique file path
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const storagePath = `${userId}/${documentType}/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('id-documents')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('id-documents')
      .getPublicUrl(storagePath);

    // Save metadata to database
    const documentData: Omit<IDDocument, 'id' | 'user_id' | 'file_url' | 'upload_date' | 'created_at' | 'updated_at'> = {
      document_type: documentType,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      storage_path: storagePath
    };

    const { data: dbData, error: dbError } = await supabase
      .from('id_documents')
      .insert([{ ...documentData, user_id: userId }])
      .select()
      .single();

    if (dbError) {
      // If database insert fails, clean up the uploaded file
      await supabase.storage
        .from('id-documents')
        .remove([storagePath]);
      throw new Error(`Database save failed: ${dbError.message}`);
    }

    // Return the complete document data
    return {
      ...dbData,
      file_url: urlData.publicUrl
    } as UploadedIDDocument;

  } catch (error) {
    console.error('Error uploading ID document:', error);
    throw error;
  }
};

/**
 * Get all ID documents for a user
 */
export const getUserIDDocuments = async (userId: string): Promise<UploadedIDDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('id_documents')
      .select('*')
      .eq('user_id', userId)
      .order('upload_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching ID documents:', error);
    throw error;
  }
};

/**
 * Get ID documents by type for a user
 */
export const getUserIDDocumentsByType = async (
  userId: string,
  documentType: IDDocument['document_type']
): Promise<UploadedIDDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('id_documents')
      .select('*')
      .eq('user_id', userId)
      .eq('document_type', documentType)
      .order('upload_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch ${documentType} documents: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error(`Error fetching ${documentType} documents:`, error);
    throw error;
  }
};

/**
 * Delete an ID document from both storage and database
 */
export const deleteIDDocument = async (documentId: string, userId: string): Promise<void> => {
  try {
    // First get the document to get the storage path
    const { data: document, error: fetchError } = await supabase
      .from('id_documents')
      .select('storage_path')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      throw new Error(`Document not found: ${fetchError.message}`);
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('id-documents')
      .remove([document.storage_path]);

    if (storageError) {
      console.warn('Failed to delete from storage:', storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('id_documents')
      .delete()
      .eq('id', documentId)
      .eq('user_id', userId);

    if (dbError) {
      throw new Error(`Failed to delete from database: ${dbError.message}`);
    }

  } catch (error) {
    console.error('Error deleting ID document:', error);
    throw error;
  }
};

/**
 * Update document metadata in database
 */
export const updateIDDocument = async (
  documentId: string,
  userId: string,
  updates: Partial<Pick<IDDocument, 'file_name' | 'document_type'>>
): Promise<UploadedIDDocument> => {
  try {
    const { data, error } = await supabase
      .from('id_documents')
      .update(updates)
      .eq('id', documentId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update document: ${error.message}`);
    }

    return data as UploadedIDDocument;
  } catch (error) {
    console.error('Error updating ID document:', error);
    throw error;
  }
};

/**
 * Get document by ID
 */
export const getIDDocumentById = async (documentId: string, userId: string): Promise<UploadedIDDocument | null> => {
  try {
    const { data, error } = await supabase
      .from('id_documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw new Error(`Failed to fetch document: ${error.message}`);
    }

    return data as UploadedIDDocument;
  } catch (error) {
    console.error('Error fetching ID document:', error);
    throw error;
  }
};

/**
 * Check if user has any ID documents
 */
export const hasUserIDDocuments = async (userId: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('id_documents')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to check documents: ${error.message}`);
    }

    return (count || 0) > 0;
  } catch (error) {
    console.error('Error checking ID documents:', error);
    return false;
  }
};

/**
 * Get document count by type for a user
 */
export const getDocumentCountByType = async (
  userId: string,
  documentType?: IDDocument['document_type']
): Promise<number> => {
  try {
    let query = supabase
      .from('id_documents')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (documentType) {
      query = query.eq('document_type', documentType);
    }

    const { count, error } = await query;

    if (error) {
      throw new Error(`Failed to get document count: ${error.message}`);
    }

    return count || 0;
  } catch (error) {
    console.error('Error getting document count:', error);
    return 0;
  }
};
