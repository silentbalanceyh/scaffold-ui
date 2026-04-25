# Ux — DnD, Batch, G2 & G6

> Source: `src/ux/interface.romantic.js` + `interface.g2.js` + `interface.g6.js`

## Drag & Drop

| Function | Purpose |
|----------|---------|
| `dndDropColor(event)` | Drop color handler |
| `dndDropWrap(reference, key)` | Drop wrapper |
| `dndDropHoc(reference)` | Drop HOC |
| `dndDragHoc(reference)` | Drag HOC |
| `dndDragWrap(reference, key)` | Drag wrapper |

## Batch Operations (romantic)

| Function | Purpose |
|----------|---------|
| `rxBatchEdit(reference, key)` | Reactive batch edit |
| `sexBatch(reference, key)` | Batch operation |
| `sexCab(reference, key)` | Cab-based operation |
| `sexOp(reference, key)` | Op-based operation |
| `sexModal(reference, key)` | Modal operation |
| `sexIdentifier(reference, key)` | Identifier operation |
| `sexTable(reference, key)` | Table operation |
| `sexDialog(reference, key)` | Dialog operation |
| `sexMessage(reference, key)` | Message operation |

## G2 Chart Helpers

| Function | Purpose |
|----------|---------|
| `g2Chart(config)` | Chart base renderer |
| `g2Bar(data, config)` | Bar chart |
| `g2Pie(data, config)` | Pie chart |
| `g2Line(data, config)` | Line chart |
| `g2Broken(data, config)` | Broken line chart |
| `g2MoreLine(data, config)` | Multi-line chart |
| `g2Draw(config)` | Custom draw |
| `g2ScaleMax(data)` | Scale max helper |

## G6 Graph

| Function | Purpose |
|----------|---------|
| `g6Find(graph, id)` | Find node in G6 graph |
| `g6Edge(graph, source, target)` | Find edge |
| `g6Data(graph)` | Get graph data |
| `G6On(graph, event, callback)` | Bind G6 event |

## Aggregation

| Function | Purpose |
|----------|---------|
| `aggrSum(data, key)` | Sum values by key |
