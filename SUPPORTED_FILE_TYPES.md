# 📁 Supported File Types for File Uploads

## 🎯 **Document Types**
- **PDF** (`.pdf`) - Portable Document Format
- **Word Documents** (`.doc`, `.docx`) - Microsoft Word files
- **RTF** (`.rtf`) - Rich Text Format files
- **Text Files** (`.txt`) - Plain text documents
- **CSV** (`.csv`) - Comma-separated values
- **Excel** (`.xlsx`) - Microsoft Excel spreadsheets

## 🖼️ **Image Types**
- **JPEG** (`.jpg`, `.jpeg`) - Joint Photographic Experts Group
- **PNG** (`.png`) - Portable Network Graphics
- **GIF** (`.gif`) - Graphics Interchange Format
- **WebP** (`.webp`) - Web Picture format

## 🎥 **Video Types**
- **MP4** (`.mp4`) - MPEG-4 video files
- **QuickTime** (`.mov`) - Apple QuickTime format
- **AVI** (`.avi`) - Audio Video Interleave

## 🎵 **Audio Types**
- **MP3** (`.mp3`) - MPEG Audio Layer III
- **WAV** (`.wav`) - Waveform Audio File Format
- **M4A** (`.m4a`) - MPEG-4 Audio
- **AAC** (`.aac`) - Advanced Audio Coding

## ⚙️ **Technical Details**

### **File Size Limit**
- **Maximum file size**: 50MB per file

### **Storage Configuration**
- **Bucket name**: `legacy-files`
- **Public access**: Enabled (for QR code functionality)
- **User isolation**: Each user's files are stored in their own folder

### **Security**
- Users can only access their own uploaded files
- Public read access enabled for QR code scanning
- Row Level Security (RLS) policies in place

## 🚀 **Usage**

1. **Upload files** in Section 16 (File Uploads & Multimedia)
2. **Generate QR codes** automatically for each file
3. **Include QR codes** in PDF exports
4. **Scan QR codes** with any phone to access files

## 📱 **QR Code Functionality**

Each uploaded file gets:
- ✅ **Unique QR code** linking directly to the file
- ✅ **File metadata** (name, type, description)
- ✅ **Public access** via QR code scanning
- ✅ **Mobile-friendly** access from any device

---

*Last updated: January 2025* 