import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from 'expo-status-bar';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const inverterCompanies = [
  { label: 'Select company', value: '' },
  { label: 'SMA', value: 'SMA' },
  { label: 'Fronius', value: 'Fronius' },
  { label: 'GoodWe', value: 'GoodWe' },
  { label: 'Huawei', value: 'Huawei' },
  { label: 'Sungrow', value: 'Sungrow' },
  { label: 'Microtek', value: 'Microtek' },
  { label: 'Other', value: 'Other' }
];

export default function App() {
  const [clientName, setClientName] = useState('');
  const [clientNumber, setClientNumber] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [installedKw, setInstalledKw] = useState('');

  const [panelSerials, setPanelSerials] = useState(Array(6).fill('').map((_, i) => ({ id: i + 1, value: '' })));

  const addPanelSerial = () => {
    setPanelSerials(prev => [...prev, { id: prev.length + 1, value: '' }]);
  };

  const updatePanelSerial = (index, text) => {
    setPanelSerials(prev => prev.map((row, i) => i === index ? { ...row, value: text } : row));
  };

  const [inverterCompany, setInverterCompany] = useState('');
  const [inverterKw, setInverterKw] = useState('');
  const [inverterSerial, setInverterSerial] = useState('');

  const [installDate, setInstallDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (_, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setInstallDate(selectedDate);
  };

  const handleSubmit = () => {
    // basic validation
    if (!clientName.trim()) { alert('Enter client name'); return; }
    if (!clientNumber.trim()) { alert('Enter mobile number'); return; }
    if (!clientAddress.trim()) { alert('Enter address'); return; }
    if (!installedKw.trim()) { alert('Enter installed kW'); return; }
    if (!inverterCompany) { alert('Select inverter company'); return; }
    if (!inverterKw.trim()) { alert('Enter inverter kW'); return; }
    if (!inverterSerial.trim()) { alert('Enter inverter serial'); return; }

    const payload = {
      clientName,
      clientNumber,
      clientAddress,
      installedKw,
      panelSerials: panelSerials.map(p => p.value).filter(Boolean),
      inverter: { company: inverterCompany, kw: inverterKw, serial: inverterSerial },
      installDate: installDate.toISOString().slice(0, 10)
    };
    console.log('Form submit', payload);
    alert('Saved locally (console). Hook up backend to persist.');
  };

  const handleExportPdf = async () => {
    const panelListHtml = panelSerials
      .map((p, i) => p.value ? `<tr><td style="padding:6px;border:1px solid #ddd;">${i + 1}</td><td style="padding:6px;border:1px solid #ddd;">${p.value}</td></tr>` : '')
      .join('');
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 16px; }
            h1 { font-size: 20px; }
            h2 { font-size: 16px; margin-top: 16px; }
            table { border-collapse: collapse; width: 100%; }
            td, th { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Solar Installation Record</h1>
          <h2>Client</h2>
          <table>
            <tr><td><b>Name</b></td><td>${clientName}</td></tr>
            <tr><td><b>Mobile</b></td><td>${clientNumber}</td></tr>
            <tr><td><b>Address</b></td><td>${clientAddress}</td></tr>
          </table>
          <h2>System</h2>
          <table>
            <tr><td><b>Installed kW</b></td><td>${installedKw}</td></tr>
          </table>
          <h2>Panels</h2>
          <table>
            <tr><th>#</th><th>Panel Serial</th></tr>
            ${panelListHtml || '<tr><td colspan="2">No panel serials entered</td></tr>'}
          </table>
          <h2>Inverter</h2>
          <table>
            <tr><td><b>Company</b></td><td>${inverterCompany}</td></tr>
            <tr><td><b>kW</b></td><td>${inverterKw}</td></tr>
            <tr><td><b>Serial</b></td><td>${inverterSerial}</td></tr>
          </table>
          <h2>Installation</h2>
          <table>
            <tr><td><b>Date</b></td><td>${installDate.toISOString().slice(0, 10)}</td></tr>
          </table>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Share installation PDF' });
    } else {
      alert('PDF created: ' + uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Solar Installation Record</Text>

        <Text style={styles.sectionTitle}>Client</Text>
        <TextInput style={styles.input} placeholder="Client name" value={clientName} onChangeText={setClientName} />
        <TextInput style={styles.input} placeholder="Mobile number" keyboardType="phone-pad" value={clientNumber} onChangeText={setClientNumber} />
        <TextInput style={styles.input} placeholder="Address" value={clientAddress} onChangeText={setClientAddress} />

        <Text style={styles.sectionTitle}>System Size</Text>
        <TextInput style={styles.input} placeholder="Installed kW" keyboardType="decimal-pad" value={installedKw} onChangeText={setInstalledKw} />

        <Text style={styles.sectionTitle}>Panel Serials</Text>
        {panelSerials.map((row, index) => (
          <TextInput
            key={row.id}
            style={styles.input}
            placeholder={`Panel serial #${index + 1}`}
            value={row.value}
            onChangeText={(t) => updatePanelSerial(index, t)}
          />
        ))}
        <TouchableOpacity style={styles.addBtn} onPress={addPanelSerial}>
          <Text style={styles.addBtnText}>+ Add panel serial</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Inverter</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={inverterCompany} onValueChange={setInverterCompany}>
            {inverterCompanies.map(opt => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        </View>
        <TextInput style={styles.input} placeholder="Inverter kW" keyboardType="decimal-pad" value={inverterKw} onChangeText={setInverterKw} />
        <TextInput style={styles.input} placeholder="Inverter serial number" value={inverterSerial} onChangeText={setInverterSerial} />

        <Text style={styles.sectionTitle}>Installation Date</Text>
        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateBtnText}>{installDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker value={installDate} mode="date" display="default" onChange={onChangeDate} />
        )}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: '#28a745' }]} onPress={handleExportPdf}>
          <Text style={styles.submitText}>Export PDF</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10
  },
  pickerWrap: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 8,
    marginBottom: 10
  },
  addBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#eef7ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#c8e1ff'
  },
  addBtnText: { color: '#0077ff', fontWeight: '600' },
  dateBtn: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 10
  },
  dateBtnText: { color: '#333' },
  submitBtn: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12
  },
  submitText: { color: 'white', fontWeight: '700' }
});


