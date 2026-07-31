/**
 * Indonesian region data for Provinsi → Kabupaten → Kecamatan cascading dropdowns.
 * Focused on major regions; expand as needed.
 */

export const WILAYAH_DATA: Record<string, Record<string, string[]>> = {
  "DI Yogyakarta": {
    "Kota Yogyakarta": ["Danurejan", "Gedongtengen", "Gondokusuman", "Gondomanan", "Jetis", "Kotagede", "Kraton", "Mantrijeron", "Mergangsan", "Ngampilan", "Pakualaman", "Tegalrejo", "Umbulharjo", "Wirobrajan"],
    "Sleman": ["Berbah", "Cangkringan", "Depok", "Gamping", "Godean", "Kalasan", "Minggir", "Mlati", "Moyudan", "Ngaglik", "Ngemplak", "Pakem", "Prambanan", "Seyegan", "Sleman", "Tempel", "Turi"],
    "Bantul": ["Bambanglipuro", "Banguntapan", "Bantul", "Dlingo", "Imogiri", "Jetis", "Kasihan", "Kretek", "Pajangan", "Pandak", "Piyungan", "Pleret", "Pundong", "Sanden", "Sedayu", "Sewon", "Srandakan"],
    "Gunungkidul": ["Gedangsari", "Girisubo", "Karangmojo", "Ngawen", "Nglipar", "Paliyan", "Panggang", "Patuk", "Playen", "Ponjong", "Purwosari", "Rongkop", "Saptosari", "Semanu", "Semin", "Tanjungsari", "Tepus", "Wonosari"],
    "Kulon Progo": ["Galur", "Girimulyo", "Kalibawang", "Kokap", "Lendah", "Nanggulan", "Panjatan", "Pengasih", "Samigaluh", "Sentolo", "Temon", "Wates"],
  },
  "Jawa Tengah": {
    "Kota Semarang": ["Banyumanik", "Candisari", "Gajahmungkur", "Gayamsari", "Genuk", "Gunungpati", "Mijen", "Ngaliyan", "Pedurungan", "Semarang Barat", "Semarang Selatan", "Semarang Tengah", "Semarang Timur", "Semarang Utara", "Tembalang", "Tugu"],
    "Klaten": ["Bayat", "Cawas", "Ceper", "Delanggu", "Gantiwarno", "Jatinom", "Jogonalan", "Juwiring", "Kalikotes", "Karanganom", "Karangdowo", "Karangnongko", "Kebonarum", "Kemalang", "Klaten Selatan", "Klaten Tengah", "Klaten Utara", "Manisrenggo", "Ngawen", "Pedan", "Polanharjo", "Prambanan", "Trucuk", "Tulung", "Wedi", "Wonosari"],
    "Magelang": ["Bandongan", "Borobudur", "Candimulyo", "Dukun", "Grabag", "Kajoran", "Kaliangkrik", "Mertoyudan", "Mungkid", "Muntilan", "Ngablak", "Ngluwar", "Pakis", "Salam", "Salaman", "Sawangan", "Secang", "Srumbung", "Tegalrejo", "Tempuran", "Windusari"],
    "Purworejo": ["Bagelen", "Banyuurip", "Bayan", "Bruno", "Butuh", "Gebang", "Grabag", "Kaligesing", "Kemiri", "Kutoarjo", "Loano", "Ngombol", "Pituruh", "Purwodadi", "Purworejo"],
  },
  "Jawa Barat": {
    "Kota Bandung": ["Andir", "Antapani", "Arcamanik", "Astanaanyar", "Babakan Ciparay", "Bandung Kidul", "Bandung Kulon", "Bandung Wetan", "Batununggal", "Bojongloa Kaler", "Bojongloa Kidul", "Buahbatu", "Cibeunying Kaler", "Cibeunying Kidul", "Cicendo", "Cidadap", "Cinambo", "Coblong", "Gedebage", "Kiaracondong", "Lengkong", "Mandalajati", "Panyileukan", "Rancasari", "Regol", "Sukajadi", "Sukasari", "Sumur Bandung", "Ujungberung"],
    "Bogor": ["Babakan Madang", "Bojonggede", "Cariu", "Ciampea", "Ciawi", "Cibinong", "Cigombong", "Cigudeg", "Cijeruk", "Cileungsi", "Ciomas", "Cisarua", "Citeureup", "Dramaga", "Gunung Putri", "Gunungsindur", "Jasinga", "Jonggol", "Kemang", "Klapanunggal", "Leuwiliang", "Leuwisadeng", "Megamendung", "Nanggung", "Pamijahan", "Parung", "Parung Panjang", "Rancabungur", "Rumpin", "Sukamakmur", "Sukaraja", "Tajur Halang", "Tamansari", "Tanjungsari", "Tenjo", "Tenjolaya"],
  },
  "DKI Jakarta": {
    "Jakarta Selatan": ["Cilandak", "Jagakarsa", "Kebayoran Baru", "Kebayoran Lama", "Mampang Prapatan", "Pasar Minggu", "Pancoran", "Pesanggrahan", "Setiabudi", "Tebet"],
    "Jakarta Pusat": ["Cempaka Putih", "Gambir", "Johar Baru", "Kemayoran", "Menteng", "Sawah Besar", "Senen", "Tanah Abang"],
    "Jakarta Barat": ["Cengkareng", "Grogol Petamburan", "Kalideres", "Kebon Jeruk", "Kembangan", "Palmerah", "Taman Sari", "Tambora"],
    "Jakarta Timur": ["Ciracas", "Cipayung", "Cakung", "Duren Sawit", "Jatinegara", "Kramat Jati", "Makasar", "Matraman", "Pasar Rebo", "Pulo Gadung"],
    "Jakarta Utara": ["Cilincing", "Kelapa Gading", "Koja", "Pademangan", "Penjaringan", "Tanjung Priok"],
  },
  "Jawa Timur": {
    "Kota Surabaya": ["Asemrowo", "Benowo", "Bubutan", "Bulak", "Dukuh Pakis", "Gayungan", "Genteng", "Gubeng", "Gunung Anyar", "Jambangan", "Karang Pilang", "Kenjeran", "Krembangan", "Lakarsantri", "Mulyorejo", "Pabean Cantian", "Pakal", "Rungkut", "Sambikerep", "Sawahan", "Semampir", "Simokerto", "Sukolilo", "Sukomanunggal", "Tambaksari", "Tandes", "Tegalsari", "Tenggilis Mejoyo", "Wiyung", "Wonocolo", "Wonokromo"],
    "Malang": ["Ampelgading", "Bantur", "Bululawang", "Dampit", "Dau", "Donomulyo", "Gedangan", "Gondanglegi", "Jabung", "Kalipare", "Karangploso", "Kasembon", "Kepanjen", "Kromengan", "Lawang", "Ngajum", "Ngantang", "Pagak", "Pakis", "Pakisaji", "Pagelaran", "Poncokusumo", "Pujon", "Singosari", "Sumbermanjing Wetan", "Sumberpucung", "Tajinan", "Tirtoyudo", "Tumpang", "Turen", "Wagir", "Wajak", "Wonosari"],
    "Sidoarjo": ["Balongbendo", "Buduran", "Candi", "Gedangan", "Jabon", "Krembung", "Krian", "Porong", "Prambon", "Sedati", "Sidoarjo", "Sukodono", "Taman", "Tanggulangin", "Tarik", "Tulangan", "Waru", "Wonoayu"],
  },
};

export const PROVINSI_LIST = Object.keys(WILAYAH_DATA);

export function getKabupatenList(provinsi: string): string[] {
  return Object.keys(WILAYAH_DATA[provinsi] ?? {});
}

export function getKecamatanList(provinsi: string, kabupaten: string): string[] {
  return WILAYAH_DATA[provinsi]?.[kabupaten] ?? [];
}

export const BANK_LIST = [
  "BCA", "BNI", "BRI", "Mandiri", "CIMB Niaga", "Danamon",
  "Permata", "BSI (Bank Syariah Indonesia)", "BTN", "BPD DIY",
  "Jago", "SeaBank", "Jenius", "Allo Bank",
];
