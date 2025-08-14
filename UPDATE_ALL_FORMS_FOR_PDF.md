# Update All Forms for PDF User Information

## Forms that need userInfo added to PDF generation:

### ✅ COMPLETED:
- MedicalInfoForm.tsx
- PersonalInformationForm.tsx  
- LegalEstateForm.tsx
- FinanceBusinessForm.tsx
- BeneficiariesInheritanceForm.tsx
- PersonalPropertyRealEstateForm.tsx
- DigitalLifeForm.tsx

### ❌ STILL NEED UPDATES:
- KeyContactsForm.tsx
- FuneralFinalArrangementsForm.tsx
- AccountsMembershipsForm.tsx
- PetsAnimalCareForm.tsx
- ShortLettersForm.tsx
- FinalWishesLegacyPlanningForm.tsx
- BucketListUnfinishedBusinessForm.tsx
- FormalLettersForm.tsx
- FileUploadsMultimediaForm.tsx
- TransitionNotesForm.tsx
- FinalMessagesForm.tsx
- ObituaryMemoryWishesForm.tsx

## Required Changes for Each Form:

### 1. Add userInfo state:
```typescript
const [userInfo, setUserInfo] = useState<{ firstName?: string; lastName?: string; email?: string }>({});
```

### 2. Add fetchUserInfo function:
```typescript
// Fetch user information for PDF footer
const fetchUserInfo = async () => {
  if (!user?.email) return;
  
  try {
    // Get user data from personal_info table
    const { data: personalInfo, error } = await supabase
      .from('personal_info')
      .select('legal_first_name, legal_last_name')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user info:', error);
      return;
    }
    
    setUserInfo({
      firstName: personalInfo?.legal_first_name || '',
      lastName: personalInfo?.legal_last_name || '',
      email: user.email
    });
  } catch (error) {
    console.error('Error in fetchUserInfo:', error);
  }
};

// Fetch user info when component mounts
useEffect(() => {
  if (user?.email) {
    fetchUserInfo();
  }
}, [user?.email]);
```

### 3. Add required imports:
```typescript
import { supabase } from '@/lib/supabase';
```

### 4. Update PDF generation call:
```typescript
generatePDF({
  sectionTitle: 'Section Title',
  data: formData,
  formType: 'formType',
  userTier,
  isTrial,
  userInfo: userInfo  // Add this line
});
```

## Priority Order:
1. KeyContactsForm.tsx (high usage)
2. FuneralFinalArrangementsForm.tsx (high usage)
3. AccountsMembershipsForm.tsx (high usage)
4. PetsAnimalCareForm.tsx (medium usage)
5. ShortLettersForm.tsx (medium usage)
6. FinalWishesLegacyPlanningForm.tsx (medium usage)
7. BucketListUnfinishedBusinessForm.tsx (low usage)
8. FormalLettersForm.tsx (low usage)
9. FileUploadsMultimediaForm.tsx (low usage)
10. TransitionNotesForm.tsx (low usage)
11. FinalMessagesForm.tsx (low usage)
12. ObituaryMemoryWishesForm.tsx (low usage)
