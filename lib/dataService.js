import { supabase, isSupabaseConfigured } from './supabase';
import { 
  getStoredTiles, saveTile, deleteTile,
  getStoredCatalogues, saveCatalogue, deleteCatalogue,
  getStoredEnquiries, saveEnquiry, updateStoredEnquiryStatus, deleteStoredEnquiry,
  getStoredSeries, saveSeries, deleteSeries
} from './mockData';

export const dataService = {
  // === TILES ===
  async getTiles() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('tiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
        console.warn("Supabase query error, falling back to mock:", error);
      } catch (e) {
        console.warn("Supabase client failed, falling back to mock:", e);
      }
    }
    return getStoredTiles();
  },

  async getTileById(id) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('tiles')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase client failed to fetch tile, falling back to mock:", e);
      }
    }
    return getStoredTiles().find(item => item.id === id) || null;
  },
  
  async addTile(tileData, imageFile) {
    let imageUrl = tileData.image_url || '/images/hero_marble.png';
    
    // Upload image to Supabase if active and file is provided
    if (isSupabaseConfigured && imageFile) {
      try {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `tile-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('tile-images')
          .upload(fileName, imageFile, { upsert: true });
          
        if (uploadError) {
          if (uploadError.message === 'Bucket not found') {
            throw new Error('Supabase Storage Bucket "tile-images" not found. Please create this bucket in your Supabase Console and enable public access.');
          }
          throw new Error(`Storage upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('tile-images')
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      } catch (e) {
        console.error("Storage upload failed:", e);
        throw e;
      }
    }
    
    const tileRecord = { 
      name: tileData.name,
      description: tileData.description,
      location: tileData.location || "Indoor",
      thickness: tileData.thickness || "10mm",
      dimension: tileData.dimension || "600x1200",
      series: tileData.series || "",
      finish: tileData.finish || "Glossy",
      random_faces: tileData.random_faces || "01",
      external_link: tileData.external_link || "",
      image_url: imageUrl
    };
    
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('tiles')
          .insert([tileRecord])
          .select()
          .single();
        if (!error && data) return data;
        console.error("Supabase insert error:", error);
      } catch (e) {
        console.error("Failed to insert in Supabase:", e);
      }
    }
    
    return saveTile(tileRecord);
  },

  async removeTile(id, imageUrl) {
    if (isSupabaseConfigured) {
      try {
        // Try to delete image file from storage if it belongs to Supabase
        if (imageUrl && imageUrl.includes('/storage/v1/object/public/tile-images/')) {
          const fileName = imageUrl.split('/').pop();
          if (fileName) {
            await supabase.storage.from('tile-images').remove([fileName]);
          }
        }
        
        const { error } = await supabase
          .from('tiles')
          .delete()
          .eq('id', id);
          
        if (!error) return true;
        console.error("Supabase delete error:", error);
      } catch (e) {
        console.error("Failed to delete in Supabase:", e);
      }
    }
    
    deleteTile(id);
    return true;
  },

  // === SERIES ===
  async getSeries() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('series')
          .select('*')
          .order('name', { ascending: true });
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase series query failed, falling back to mock:", e);
      }
    }
    return getStoredSeries();
  },

  async addSeries(seriesData, imageFile) {
    let imageUrl = seriesData.image_url || 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=400&q=80';

    if (isSupabaseConfigured && imageFile) {
      try {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `series-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('series-images')
          .upload(fileName, imageFile, { upsert: true });

        if (uploadError) {
          if (uploadError.message === 'Bucket not found') {
            throw new Error('Supabase Storage Bucket "series-images" not found. Please create this bucket in your Supabase Console and enable public access.');
          }
          throw new Error(`Storage upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('series-images')
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      } catch (e) {
        console.error("Supabase storage upload failed:", e);
        throw e;
      }
    }

    const seriesRecord = {
      name: seriesData.name,
      dimension: seriesData.dimension,
      image_url: imageUrl
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('series')
          .insert([seriesRecord])
          .select()
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.error("Failed to insert series in Supabase:", e);
      }
    }

    return saveSeries(seriesRecord);
  },

  async removeSeries(id, seriesName) {
    // Cascade: delete all tiles belonging to this series first
    if (isSupabaseConfigured) {
      try {
        // 1. Fetch tiles in this series to clean up their storage images
        const { data: seriesToDelete } = await supabase
          .from('tiles')
          .select('id, image_url')
          .eq('series', seriesName);

        if (seriesToDelete && seriesToDelete.length > 0) {
          // Delete storage images
          const filesToRemove = seriesToDelete
            .filter(t => t.image_url && t.image_url.includes('/storage/v1/object/public/tile-images/'))
            .map(t => t.image_url.split('/').pop())
            .filter(Boolean);
          if (filesToRemove.length > 0) {
            await supabase.storage.from('tile-images').remove(filesToRemove);
          }

          // Delete tile rows
          await supabase
            .from('tiles')
            .delete()
            .eq('series', seriesName);
        }

        // 2. Delete the series row
        const { error } = await supabase
          .from('series')
          .delete()
          .eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.error("Failed to cascade-delete series in Supabase:", e);
      }
    }

    // Fallback: localStorage cascade
    const localTiles = getStoredTiles().filter(t => t.series === seriesName);
    localTiles.forEach(t => deleteTile(t.id));
    deleteSeries(id);
    return true;
  },

  // === CATALOGUES ===
  async getCatalogues() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('catalogues')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
        console.warn("Supabase query error, falling back to catalogues mock:", error);
      } catch (e) {
        console.warn("Supabase client failed, falling back to catalogues mock:", e);
      }
    }
    return getStoredCatalogues();
  },

  async addCatalogue(catalogueData, coverFile, pdfFile) {
    let coverUrl = catalogueData.cover_image_url || 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=600&q=80';
    let pdfUrl = catalogueData.pdf_url || '#';

    // Upload cover image to catalogues-assets bucket
    if (isSupabaseConfigured && coverFile) {
      try {
        const fileExt = coverFile.name.split('.').pop();
        const fileName = `cover-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('catalogues-assets')
          .upload(fileName, coverFile, { upsert: true });

        if (uploadError) {
          if (uploadError.message === 'Bucket not found') {
            throw new Error('Supabase Storage Bucket "catalogues-assets" not found. Please create this bucket in your Supabase Console and enable public access.');
          }
          throw new Error(`Cover upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('catalogues-assets')
          .getPublicUrl(fileName);
        coverUrl = publicUrl;
      } catch (e) {
        console.error("Cover upload error:", e);
        throw e;
      }
    }

    // Upload PDF file to catalogues-assets bucket
    if (isSupabaseConfigured && pdfFile) {
      try {
        const fileExt = pdfFile.name.split('.').pop();
        const fileName = `pdf-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('catalogues-assets')
          .upload(fileName, pdfFile, { upsert: true });

        if (uploadError) {
          if (uploadError.message === 'Bucket not found') {
            throw new Error('Supabase Storage Bucket "catalogues-assets" not found. Please create this bucket in your Supabase Console and enable public access.');
          }
          throw new Error(`PDF upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('catalogues-assets')
          .getPublicUrl(fileName);
        pdfUrl = publicUrl;
      } catch (e) {
        console.error("PDF upload error:", e);
        throw e;
      }
    }

    const catalogueRecord = {
      title: catalogueData.title,
      description: catalogueData.description,
      dimension: catalogueData.dimension || "600x1200",
      cover_image_url: coverUrl,
      pdf_url: pdfUrl
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('catalogues')
          .insert([catalogueRecord])
          .select()
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.error("Failed to insert catalogue in Supabase:", e);
      }
    }

    return saveCatalogue(catalogueRecord);
  },

  async removeCatalogue(id, coverUrl, pdfUrl) {
    if (isSupabaseConfigured) {
      try {
        // Delete files from storage
        const filesToRemove = [];
        if (coverUrl && coverUrl.includes('/catalogues-assets/')) {
          filesToRemove.push(coverUrl.split('/').pop());
        }
        if (pdfUrl && pdfUrl.includes('/catalogues-assets/')) {
          filesToRemove.push(pdfUrl.split('/').pop());
        }
        if (filesToRemove.length > 0) {
          await supabase.storage.from('catalogues-assets').remove(filesToRemove);
        }

        const { error } = await supabase
          .from('catalogues')
          .delete()
          .eq('id', id);

        if (!error) return true;
      } catch (e) {
        console.error("Failed to delete catalogue in Supabase:", e);
      }
    }

    deleteCatalogue(id);
    return true;
  },

  // === ENQUIRIES ===
  async getEnquiries() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase failed fetching enquiries, falling back to mock:", e);
      }
    }
    return getStoredEnquiries();
  },

  async addEnquiry(enquiryData) {
    const enquiryRecord = {
      tile_name: enquiryData.tile_name,
      user_name: enquiryData.user_name,
      user_email: enquiryData.user_email,
      user_phone: enquiryData.user_phone || '',
      message: enquiryData.message || '',
      status: enquiryData.status || 'Pending'
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('enquiries')
          .insert([enquiryRecord])
          .select()
          .single();
        if (!error && data) return data;
        console.error("Supabase enquiry error:", error);
      } catch (e) {
        console.error("Failed to insert enquiry in Supabase:", e);
      }
    }

    return saveEnquiry(enquiryRecord);
  },

  async updateEnquiryStatus(id, status) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('enquiries')
          .update({ status })
          .eq('id', id)
          .select()
          .single();
        if (error) {
          console.error("Supabase update status error:", error);
          throw new Error(error.message || "Failed to update status in Supabase database.");
        }
        return data;
      } catch (e) {
        console.error("Failed to update status in Supabase:", e);
        throw e;
      }
    }

    return updateStoredEnquiryStatus(id, status);
  },

  async removeEnquiry(id) {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('enquiries')
          .delete()
          .eq('id', id);
        if (error) {
          console.error("Supabase delete enquiry error:", error);
          throw new Error(error.message || "Failed to delete enquiry from Supabase database.");
        }
        return true;
      } catch (e) {
        console.error("Failed to delete enquiry in Supabase:", e);
        throw e;
      }
    }

    deleteStoredEnquiry(id);
    return true;
  }
};
