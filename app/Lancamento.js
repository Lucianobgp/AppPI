import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const LancamentosFinanceiros = () => {
  // Estados do formulário
  const [idLanc, setIdLanc] = useState(null);
  const [idCadTipo, setIdCadTipo] = useState('');
  const [idCadPlano, setIdCadPlano] = useState('');
  const [descLanc, setDescLanc] = useState('');
  const [dataVenc, setDataVenc] = useState(new Date());
  const [showDateVenc, setShowDateVenc] = useState(false);
  const [valorLanc, setValorLanc] = useState('');
  const [idCadForma, setIdCadForma] = useState('');
  const [idCadBanco, setIdCadBanco] = useState('');
  const [idCadCartao, setIdCadCartao] = useState('');
  const [dataRecPag, setDataRecPag] = useState(null); // sem valor padrão
  const [showDateRecPag, setShowDateRecPag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSelects, setLoadingSelects] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Dados dos selects
  const [tipos, setTipos] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [formas, setFormas] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [cartoes, setCartoes] = useState([]);

  // URL da API
  const API_BASE = 'http://192.168.0.100/projeto-integrador-3.0/';
  const API_URL = `${API_BASE}api_lancamento.php`;
  const SELECTS_URL = `${API_BASE}api_selects.php`;

  // Buscar selects ao carregar
  useEffect(() => {
    const buscarDadosSelects = async () => {
      try {
        setLoadingSelects(true);
        const response = await fetch(SELECTS_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        setTipos(data.tipos || []);
        setPlanos(data.planos || []);
        setFormas(data.formas || []);
        setBancos(data.bancos || []);
        setCartoes(data.cartoes || []);

      // ================= DEFAULTS =================
      // Banco e Cartão com id = 1
      const bancoDefault = (data.bancos || []).find(b => b.id === 1);
      if (bancoDefault) setIdCadBanco(bancoDefault.id.toString());

      const cartaoDefault = (data.cartoes || []).find(c => c.id === 1);
      if (cartaoDefault) setIdCadCartao(cartaoDefault.id.toString());
      // ===========================================

      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do formulário.');
        console.error('Erro ao buscar selects:', error);
      } finally {
        setLoadingSelects(false);
      }
    };
    buscarDadosSelects();
  }, []);

  // Date pickers
  const onChangeDateVenc = (event, selectedDate) => {
    const currentDate = selectedDate || dataVenc;
    setShowDateVenc(Platform.OS === 'ios');
    setDataVenc(currentDate);
  };

  const onChangeDateRecPag = (event, selectedDate) => {
    const currentDate = selectedDate || dataRecPag;
    setShowDateRecPag(Platform.OS === 'ios');
    if (selectedDate) setDataRecPag(selectedDate);
  };

  const formatDateForAPI = (date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;

  const formatDateForDisplay = (date) =>
    `${date.getDate().toString().padStart(2,'0')}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getFullYear()}`;

  const limparFormulario = () => {
    setIdLanc(null);
    setIdCadTipo('');
    setIdCadPlano('');
    setDescLanc('');
    setDataVenc(new Date());
    setValorLanc('');
    setIdCadForma('');
    setIdCadBanco('');
    setIdCadCartao('');
    setDataRecPag(null); // limpa o campo
    setEditMode(false);
  };

  const validarFormulario = () => {
    if (!idCadTipo || !idCadPlano || !descLanc || !valorLanc || !idCadForma || !idCadBanco || !idCadCartao) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    return true;
  };

  const salvarLancamento = async () => {
    if (!validarFormulario()) return;
    setLoading(true);

    try {
      const lancamentoData = {
        id_cad_tipo: parseInt(idCadTipo),
        id_cad_plano: parseInt(idCadPlano),
        desc_lanc: descLanc,
        data_venc: formatDateForAPI(dataVenc),
        valor_lanc: parseFloat(valorLanc.replace(',', '.')),
        id_cad_forma: parseInt(idCadForma),
        id_cad_banco: parseInt(idCadBanco),
        id_cad_cartao: parseInt(idCadCartao),
        data_rec_pag: dataRecPag ? formatDateForAPI(dataRecPag) : null
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(lancamentoData)
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Sucesso', result.message);
        limparFormulario();
      } else {
        Alert.alert('Erro', result.message || 'Erro ao salvar o lançamento.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // CustomSelect
  const CustomSelect = ({ options, selectedValue, onValueChange, placeholder, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.id.toString() === selectedValue?.toString());

    return (
      <View style={{ marginBottom: 10 }}>
        <TouchableOpacity
          style={[styles.select, disabled && styles.selectDisabled]}
          onPress={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <Text style={selectedOption ? styles.selectText : styles.placeholderText}>
            {selectedOption ? selectedOption.nome : placeholder}
          </Text>
          <Text style={styles.selectArrow}>{isOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {isOpen && (
          <View style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            marginTop: 5,
            backgroundColor: 'white',
            maxHeight: 250,
            zIndex: 999,
          }}>
            <ScrollView nestedScrollEnabled={true}>
              {options.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.selectOption}
                  onPress={() => { onValueChange(option.id.toString()); setIsOpen(false); }}
                >
                  <Text style={styles.selectOptionText}>{option.nome}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  if (loadingSelects) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Carregando formulário...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>
            {editMode ? '✏️ Editar Lançamento' : '📋 Novo Lançamento'}
          </Text>
        </View>
        <View style={styles.formContainer}>

          <Text style={styles.sectionTitle}>Informações Principais</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo *</Text>
            <CustomSelect options={tipos} selectedValue={idCadTipo} onValueChange={setIdCadTipo} placeholder="Selecione o tipo" disabled={tipos.length===0}/>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Plano *</Text>
            <CustomSelect options={planos} selectedValue={idCadPlano} onValueChange={setIdCadPlano} placeholder="Selecione o plano" disabled={planos.length===0}/>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição *</Text>
            <TextInput style={styles.input} placeholder="Digite a descrição..." value={descLanc} onChangeText={setDescLanc}/>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de vencimento *</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowDateVenc(true)}>
              <Text style={styles.dateText}>{formatDateForDisplay(dataVenc)}</Text>
            </TouchableOpacity>
            {showDateVenc && <DateTimePicker value={dataVenc} mode="date" display="default" onChange={onChangeDateVenc}/>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Valor *</Text>
            <TextInput style={styles.input} placeholder="R$ 0,00" value={valorLanc} onChangeText={setValorLanc} keyboardType="numeric"/>
          </View>

          <View style={styles.divider}/>

          <Text style={styles.sectionTitle}>Informações Adicionais</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Forma de Pagamento *</Text>
            <CustomSelect options={formas} selectedValue={idCadForma} onValueChange={setIdCadForma} placeholder="Selecione a forma" disabled={formas.length===0}/>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Banco *</Text>
            <CustomSelect options={bancos} selectedValue={idCadBanco} onValueChange={setIdCadBanco} placeholder="Selecione o banco" disabled={bancos.length===0}/>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cartão *</Text>
            <CustomSelect options={cartoes} selectedValue={idCadCartao} onValueChange={setIdCadCartao} placeholder="Selecione o cartão" disabled={cartoes.length===0}/>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Pagamento/Recebimento</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowDateRecPag(true)}>
              <Text style={styles.dateText}>{dataRecPag ? formatDateForDisplay(dataRecPag) : 'Selecione a data'}</Text>
            </TouchableOpacity>
            {showDateRecPag && (
              <DateTimePicker
                value={dataRecPag || new Date()}
                mode="date"
                display="default"
                onChange={onChangeDateRecPag}
              />
            )}
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={[styles.button, styles.limparButton]} onPress={limparFormulario} disabled={loading}>
              <Text style={styles.limparButtonText}>🗑️ Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.salvarButton]} onPress={salvarLancamento} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.salvarButtonText}>{editMode ? '💾 Atualizar' : '💾 Salvar'}</Text>}
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </ScrollView>
  );
};

// ================== STYLES ==================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 10 },
  loadingContainer: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#f8f9fa' },
  loadingText: { marginTop:10, fontSize:16, color:'#7c3aed' },
  card: { backgroundColor:'white', borderRadius:18, shadowColor:'#7c3aed', shadowOffset:{width:0,height:4}, shadowOpacity:0.15, shadowRadius:32, elevation:5, marginVertical:10, marginBottom:30 },
  cardHeader: { backgroundColor:'#7c3aed', borderTopLeftRadius:18, borderTopRightRadius:18, padding:20, alignItems:'center' },
  cardHeaderText: { color:'#ffd700', fontSize:20, fontWeight:'bold' },
  formContainer: { padding:20 },
  sectionTitle: { color:'#7c3aed', fontSize:18, fontWeight:'600', marginBottom:15, borderBottomWidth:2, borderBottomColor:'#e0e5ec', paddingBottom:10 },
  inputGroup: { marginBottom:20 },
  label: { color:'#7c3aed', fontWeight:'500', marginBottom:8, fontSize:16 },
  input: { borderWidth:1.5, borderColor:'#7c3aed', borderRadius:8, padding:15, backgroundColor:'white', fontSize:16 },
  select: { borderWidth:1.5, borderColor:'#7c3aed', borderRadius:8, padding:15, backgroundColor:'white', flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  selectDisabled: { backgroundColor:'#f0f0f0', borderColor:'#ccc' },
  selectText: { fontSize:16, color:'#000' },
  placeholderText: { fontSize:16, color:'#888' },
  selectArrow: { fontSize:12, color:'#7c3aed' },
  selectOption: { padding:15, borderBottomWidth:1, borderBottomColor:'#eee' },
  selectOptionText: { fontSize:16 },
  dateInput: { borderWidth:1.5, borderColor:'#7c3aed', borderRadius:8, padding:15, backgroundColor:'white' },
  dateText: { fontSize:16 },
  divider: { height:1, backgroundColor:'#e0e5ec', marginVertical:25 },
  buttonGroup: { flexDirection:'row', justifyContent:'space-between', marginTop:20 },
  button: { borderRadius:8, padding:15, minWidth:'45%', alignItems:'center', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.2, shadowRadius:3, elevation:3 },
  limparButton: { backgroundColor:'#ffd700', borderWidth:1.5, borderColor:'#ffd700' },
  salvarButton: { backgroundColor:'#7c3aed' },
  limparButtonText: { fontWeight:'600', color:'#7c3aed', fontSize:16 },
  salvarButtonText: { fontWeight:'600', color:'white', fontSize:16 },
});

export default LancamentosFinanceiros;
