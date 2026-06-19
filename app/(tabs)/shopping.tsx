import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockRepository } from '../../services/mockRepository';

const { shoppingLists: SHOPPING_LISTS, shoppingItems: SHOPPING_ITEMS } = mockRepository;
import { Colors } from '../../constants/theme';
import { EmptyState } from '../../components/EmptyState';

const CATEGORY_ICONS: Record<string, string> = { food: '🥦', household: '🧹', personal: '🧴', other: '📦' };

export default function ShoppingScreen() {
  const [activeList, setActiveList] = useState(SHOPPING_LISTS[0].id);
  const [items, setItems] = useState(SHOPPING_ITEMS);

  const listItems = items.filter(i => i.listId === activeList);
  const unbought = listItems.filter(i => !i.bought);
  const bought = listItems.filter(i => i.bought);

  const toggle = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, bought: !i.bought } : i));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={styles.tabContent}
      >
        {SHOPPING_LISTS.map(l => (
          <Pressable
            key={l.id}
            style={[styles.tab, activeList === l.id && styles.tabActive]}
            onPress={() => setActiveList(l.id)}
          >
            <Text style={[styles.tabLabel, activeList === l.id && styles.tabLabelActive]}>{l.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {listItems.length === 0 ? (
          <EmptyState icon="🛒" message="No shopping chaos logged yet." sub="Add something before one of you forgets." />
        ) : (
          <>
            {unbought.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>To get · {unbought.length}</Text>
                <View style={styles.stack}>
                  {unbought.map(item => (
                    <Pressable key={item.id} style={styles.itemCard} onPress={() => toggle(item.id)}>
                      <View style={styles.checkbox} />
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        {item.notes && <Text style={styles.itemNotes}>{item.notes}</Text>}
                      </View>
                      <View style={styles.itemRight}>
                        {item.quantity && <Text style={styles.qty}>×{item.quantity}</Text>}
                        <Text style={styles.catIcon}>{CATEGORY_ICONS[item.category]}</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {bought.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Got · {bought.length}</Text>
                <View style={styles.stack}>
                  {bought.map(item => (
                    <Pressable key={item.id} style={[styles.itemCard, styles.itemBought]} onPress={() => toggle(item.id)}>
                      <View style={[styles.checkbox, styles.checkboxChecked]}>
                        <Text style={styles.checkmark}>✓</Text>
                      </View>
                      <Text style={[styles.itemName, styles.itemNameBought]}>{item.name}</Text>
                      {item.quantity && <Text style={styles.qty}>×{item.quantity}</Text>}
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  tabScroll: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  tab: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 8,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface,
  },
  tabActive: { backgroundColor: Colors.accent + '30', borderColor: Colors.accent },
  tabLabel: { color: Colors.secondary, fontSize: 13, fontWeight: '500' },
  tabLabelActive: { color: Colors.primary },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 100 },
  section: { marginBottom: 20 },
  sectionLabel: { color: Colors.secondary, fontSize: 12, fontWeight: '600', marginBottom: 8, letterSpacing: 0.3 },
  stack: { gap: 8 },
  itemCard: {
    backgroundColor: Colors.surface, borderRadius: 10, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: Colors.border,
  },
  itemBought: { opacity: 0.5 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5,
    borderWidth: 1.5, borderColor: Colors.secondary,
  },
  checkboxChecked: {
    backgroundColor: Colors.accent, borderColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  checkmark: { color: Colors.primary, fontSize: 11, fontWeight: '700' },
  itemInfo: { flex: 1 },
  itemName: { color: Colors.primary, fontSize: 14, fontWeight: '500' },
  itemNameBought: { textDecorationLine: 'line-through', color: Colors.secondary },
  itemNotes: { color: Colors.secondary, fontSize: 11, marginTop: 2 },
  itemRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qty: { color: Colors.secondary, fontSize: 12 },
  catIcon: { fontSize: 16 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 24, backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.border },
  addButton: { backgroundColor: Colors.accent, borderRadius: 10, padding: 14, alignItems: 'center' },
  addButtonText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
});
