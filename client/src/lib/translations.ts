export type Language = 'en' | 'uz' | 'ru';

export const translations = {
  en: {
    // Header
    appTitle: 'GeoTag Editor',
    appSubtitle: 'Add, edit or remove GPS metadata',
    
    // File Uploader
    dragDropText: 'Drag and drop your image here',
    orText: 'or',
    selectFileButton: 'Select File',
    supportedFormats: 'Supported: JPG, JPEG',
    
    // Coordinate Form
    latitude: 'Latitude',
    longitude: 'Longitude',
    altitude: 'Altitude (meters)',
    useCurrentLocation: 'Use Current Location',
    enterCoordinates: 'Enter Coordinates',
    
    // Map
    locationMap: 'Location Map',
    locationMapFullscreen: 'Location Map (Fullscreen)',
    showCurrentLocation: 'Show Current Location',
    searchLocation: 'Search location...',
    uploadImageToSetLocation: 'Upload an image to set or view GPS location',
    noLocationsFound: 'No locations found. Try a different search term.',
    searchFailed: 'Search failed. Please try again.',
    
    // EXIF Display
    exifData: 'EXIF Data',
    basicInfo: 'Basic Info',
    gpsInfo: 'GPS Info',
    cameraInfo: 'Camera Info',
    allTags: 'All Tags',
    noExifData: 'No EXIF data found',
    
    // Action Buttons
    writeExif: 'Write EXIF',
    download: 'Download',
    clear: 'Clear',
    removeGps: 'Remove GPS',
    
    // Status Messages
    gpsDataFound: 'GPS data found',
    locationLoadedFromExif: 'Location loaded from image EXIF data.',
    noGpsData: 'No GPS data',
    addCoordinatesUsingMapOrForm: 'This image has no GPS metadata. Add coordinates using the map or form.',
    errorReadingImage: 'Error reading image',
    failedToReadImage: 'Failed to read the image file.',
    geolocationNotSupported: 'Geolocation not supported',
    browserDoesNotSupportGeolocation: 'Your browser does not support geolocation.',
    locationFound: 'Location found',
    yourCurrentLocationHasBeenSet: 'Your current location has been set.',
    errorGettingLocation: 'Error getting location',
    failedToGetYourLocation: 'Failed to get your current location.',
    exifWritten: 'EXIF written',
    gpsDataSuccessfullyWritten: 'GPS data successfully written to image.',
    errorWritingExif: 'Error writing EXIF',
    failedToWriteGpsData: 'Failed to write GPS data to image.',
    exifRemoved: 'EXIF removed',
    gpsDataSuccessfullyRemoved: 'GPS data successfully removed from image.',
    errorRemovingExif: 'Error removing EXIF',
    failedToRemoveGpsData: 'Failed to remove GPS data from image.',
    invalidCoordinates: 'Invalid coordinates',
    pleaseEnterValidCoordinates: 'Please enter valid latitude and longitude values.',
    invalidLatitude: 'Invalid latitude',
    latitudeMustBeBetween: 'Latitude must be between -90 and 90.',
    invalidLongitude: 'Invalid longitude',
    longitudeMustBeBetween: 'Longitude must be between -180 and 180.',
    downloadStarted: 'Download started',
    downloadFailed: 'Download failed',
    failedToDownloadImage: 'Failed to download the image.',
    imageDownloaded: 'Image downloaded',
    modifiedImageDownloaded: 'Your modified image has been downloaded.',
    
    // Language
    language: 'Language',
    english: 'English',
    uzbek: 'Uzbek',
    russian: 'Russian',
  },
  uz: {
    // Header
    appTitle: 'GeoTag Muharrir',
    appSubtitle: 'GPS metadata qo\'shish, o\'zgartirish yoki oʻchirish',
    
    // File Uploader
    dragDropText: 'Rasmingizni bu yerga surib olib keling',
    orText: 'yoki',
    selectFileButton: 'Faylni Tanlang',
    supportedFormats: 'Qoʻllab-quvvatlanadi: JPG, JPEG',
    
    // Coordinate Form
    latitude: 'Kenglik',
    longitude: 'Uzunlik',
    altitude: 'Balandlik (metr)',
    useCurrentLocation: 'Hozirgi Joylashuvni Ishlat',
    enterCoordinates: 'Koordinatalarni Kiriting',
    
    // Map
    locationMap: 'Joylashuv Xaritasi',
    locationMapFullscreen: 'Joylashuv Xaritasi (To\'liq Ekran)',
    showCurrentLocation: 'Hozirgi Joylashuvni Ko\'rsating',
    searchLocation: 'Joylashuvni izlang...',
    uploadImageToSetLocation: 'Joylashuvni oʻrnatish yoki koʻrish uchun rasmni yuklang',
    noLocationsFound: 'Joylashuvlar topilmadi. Boshqa qidiruv shartini sinab koʻring.',
    searchFailed: 'Qidiruv muvaffaqiyatsiz boʻldi. Qayta urinib koʻring.',
    
    // EXIF Display
    exifData: 'EXIF Ma\'lumotlari',
    basicInfo: 'Asosiy Ma\'lumot',
    gpsInfo: 'GPS Ma\'lumoti',
    cameraInfo: 'Kamera Ma\'lumoti',
    allTags: 'Barcha Teglar',
    noExifData: 'EXIF ma\'lumoti topilmadi',
    
    // Action Buttons
    writeExif: 'EXIF Yozish',
    download: 'Yuklab Olish',
    clear: 'Oʻchirish',
    removeGps: 'GPS Oʻchirish',
    
    // Status Messages
    gpsDataFound: 'GPS ma\'lumoti topildi',
    locationLoadedFromExif: 'Joylashuv rasm EXIF ma\'lumotlaridan yuklandi.',
    noGpsData: 'GPS ma\'lumoti yoʻq',
    addCoordinatesUsingMapOrForm: 'Bu rasmda GPS metama\'lumoti yoʻq. Xarita yoki forma orqali koordinatalarni qo\'shing.',
    errorReadingImage: 'Rasmni oʻqishda xato',
    failedToReadImage: 'Rasm faylini oʻqishda muvaffaqiyatsiz.',
    geolocationNotSupported: 'Geolokatsiya qoʻllab-quvvatlanmaydi',
    browserDoesNotSupportGeolocation: 'Sizning brauzeringiz geolokatsiyani qoʻllab-quvatlamaydi.',
    locationFound: 'Joylashuv topildi',
    yourCurrentLocationHasBeenSet: 'Sizning hozirgi joylashuvingiz oʻrnatildi.',
    errorGettingLocation: 'Joylashuvni olishda xato',
    failedToGetYourLocation: 'Sizning hozirgi joylashuvingizni olishda muvaffaqiyatsiz.',
    exifWritten: 'EXIF yozildi',
    gpsDataSuccessfullyWritten: 'GPS ma\'lumoti rasmga muvaffaqiyatli yozildi.',
    errorWritingExif: 'EXIF yozishda xato',
    failedToWriteGpsData: 'GPS ma\'lumotini rasmga yozishda muvaffaqiyatsiz.',
    exifRemoved: 'EXIF oʻchirildi',
    gpsDataSuccessfullyRemoved: 'GPS ma\'lumoti rasmdan muvaffaqiyatli oʻchirildi.',
    errorRemovingExif: 'EXIF oʻchirishda xato',
    failedToRemoveGpsData: 'GPS ma\'lumotini rasmdan oʻchirishda muvaffaqiyatsiz.',
    invalidCoordinates: 'Noto\'g\'ri koordinatalar',
    pleaseEnterValidCoordinates: 'Iltimos, to\'g\'ri kenglik va uzunlik qiymatlarini kiriting.',
    invalidLatitude: 'Noto\'g\'ri kenglik',
    latitudeMustBeBetween: 'Kenglik -90 dan 90 gacha bo\'lishi kerak.',
    invalidLongitude: 'Noto\'g\'ri uzunlik',
    longitudeMustBeBetween: 'Uzunlik -180 dan 180 gacha bo\'lishi kerak.',
    downloadStarted: 'Yuklab olish boshlandi',
    downloadFailed: 'Yuklab olishda muvaffaqiyatsiz',
    failedToDownloadImage: 'Rasmni yuklab olishda muvaffaqiyatsiz.',
    imageDownloaded: 'Rasm yuklab olindi',
    modifiedImageDownloaded: 'Sizning o\'zgartirilgan rasmingiz yuklab olindi.',
    
    // Language
    language: 'Til',
    english: 'Ingliz',
    uzbek: 'Oʻzbek',
    russian: 'Rus',
  },
  ru: {
    // Header
    appTitle: 'Редактор GeoTag',
    appSubtitle: 'Добавляйте, редактируйте или удаляйте GPS метаданные',
    
    // File Uploader
    dragDropText: 'Перетащите ваше изображение сюда',
    orText: 'или',
    selectFileButton: 'Выбрать файл',
    supportedFormats: 'Поддерживается: JPG, JPEG',
    
    // Coordinate Form
    latitude: 'Широта',
    longitude: 'Долгота',
    altitude: 'Высота (метры)',
    useCurrentLocation: 'Использовать текущее местоположение',
    enterCoordinates: 'Введите координаты',
    
    // Map
    locationMap: 'Карта местоположения',
    locationMapFullscreen: 'Карта местоположения (Полноэкранный режим)',
    showCurrentLocation: 'Показать текущее местоположение',
    searchLocation: 'Поиск местоположения...',
    uploadImageToSetLocation: 'Загрузите изображение, чтобы установить или просмотреть расположение GPS',
    noLocationsFound: 'Местоположения не найдены. Попробуйте другой поисковый запрос.',
    searchFailed: 'Поиск не удался. Пожалуйста, попробуйте еще раз.',
    
    // EXIF Display
    exifData: 'Данные EXIF',
    basicInfo: 'Основная информация',
    gpsInfo: 'Информация GPS',
    cameraInfo: 'Информация о камере',
    allTags: 'Все теги',
    noExifData: 'Данные EXIF не найдены',
    
    // Action Buttons
    writeExif: 'Написать EXIF',
    download: 'Загрузить',
    clear: 'Очистить',
    removeGps: 'Удалить GPS',
    
    // Status Messages
    gpsDataFound: 'GPS данные найдены',
    locationLoadedFromExif: 'Местоположение загружено из данных EXIF изображения.',
    noGpsData: 'Нет данных GPS',
    addCoordinatesUsingMapOrForm: 'Это изображение не содержит GPS метаданные. Добавьте координаты, используя карту или форму.',
    errorReadingImage: 'Ошибка при чтении изображения',
    failedToReadImage: 'Не удалось прочитать файл изображения.',
    geolocationNotSupported: 'Геолокация не поддерживается',
    browserDoesNotSupportGeolocation: 'Ваш браузер не поддерживает геолокацию.',
    locationFound: 'Местоположение найдено',
    yourCurrentLocationHasBeenSet: 'Ваше текущее местоположение установлено.',
    errorGettingLocation: 'Ошибка при получении местоположения',
    failedToGetYourLocation: 'Не удалось получить ваше текущее местоположение.',
    exifWritten: 'EXIF записан',
    gpsDataSuccessfullyWritten: 'GPS данные успешно записаны в изображение.',
    errorWritingExif: 'Ошибка при написании EXIF',
    failedToWriteGpsData: 'Не удалось записать GPS данные в изображение.',
    exifRemoved: 'EXIF удален',
    gpsDataSuccessfullyRemoved: 'GPS данные успешно удалены из изображения.',
    errorRemovingExif: 'Ошибка при удалении EXIF',
    failedToRemoveGpsData: 'Не удалось удалить GPS данные из изображения.',
    invalidCoordinates: 'Недействительные координаты',
    pleaseEnterValidCoordinates: 'Пожалуйста, введите действительные значения широты и долготы.',
    invalidLatitude: 'Недействительная широта',
    latitudeMustBeBetween: 'Широта должна быть между -90 и 90.',
    invalidLongitude: 'Недействительная долгота',
    longitudeMustBeBetween: 'Долгота должна быть между -180 и 180.',
    downloadStarted: 'Загрузка началась',
    downloadFailed: 'Загрузка не удалась',
    failedToDownloadImage: 'Не удалось загрузить изображение.',
    imageDownloaded: 'Изображение загружено',
    modifiedImageDownloaded: 'Ваше измененное изображение загружено.',
    
    // Language
    language: 'Язык',
    english: 'English',
    uzbek: 'Ўзбек',
    russian: 'Русский',
  },
};

export type TranslationKey = keyof typeof translations.en;

export const getTranslation = (language: Language, key: TranslationKey): string => {
  return translations[language][key] || translations.en[key];
};
