import test from 'ava'
import message from '../message'

test('createMessage() should return a message type', t => {
  const Foo = message()
  const foo = Foo(0, 1, 2)

  t.is(Foo.is(foo), true)
  t.is(Foo.is(Foo), false)
  t.is(Foo.is(0), false)

  Foo.unwrap(foo, (x, y, z) => {
    t.is(x, 0)
    t.is(y, 1)
    t.is(z, 2)
  })
})

test('Message.unwrap() should throw if used on the wrong message type', t => {
  const Foo = message()
  const Bar = message()
  const bar = Bar(0)

  t.throws(() => {
    Foo.unwrap(bar, () => t.fail())
  })
})

test('createMessageUnion() should return a union type', t => {
  const Foo = message()
  const Bar = message()
  const Msg = message.union([Foo, Bar])

  const foo = Foo(12)
  const bar = Bar(18)

  t.is(Msg.is(foo), true)
  t.is(Msg.is(bar), true)
  t.is(Msg.is(Foo), false)
  t.is(Msg.is(Bar), false)

  Msg.unwrap(foo, x => t.is(x, foo))

  const val = Msg.match(foo, [
    Foo, n => {
      t.is(n, 12)
      return 8
    },
    Bar, () => t.fail()
  ])

  t.is(val, 8)
})

test('Union.match() should allow a catch-all', t => {
  const Foo = message()
  const Bar = message()
  const Msg = message.union([Foo, Bar])

  const foo = Foo(12)

  Msg.match(foo, [
    () => t.pass()
  ])

  Msg.match(foo, [
    Bar, () => t.fail(),
    () => t.pass()
  ])
})

test('Union.match should throw if their are missing cases and no catch-all', t => {
  const Foo = message()
  const Bar = message()
  const Msg = message.union([Foo, Bar])

  const foo = Foo(12)

  t.throws(() => {
    Msg.match(foo, [
      Foo, () => {}
    ])
  })
})