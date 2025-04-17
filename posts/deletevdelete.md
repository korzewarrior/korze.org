## `delete` vs `::delete` in C++

Most of the time you just write:

```cpp
Base* ptr = new Derived();
delete ptr;           // virtual destructor cleans up Derived as expected
```

`delete` does two things: it runs the destructor _and_ it calls the deallocation function that matches the allocation used.

If you add the global-scope qualifier:

```cpp
::delete ptr;         // forces the global operator delete
```

you bypass overload resolution and ask for the plain global `operator delete`. On **GCC** and **Clang** that means the sized-delete overload is selected with `sizeof(Base)`, so only the base-class portion of the allocation is released. **MSVC** still frees the full block because it passes the real size through the destructor.

### When would you ever want `::delete`?

Pretty much only when you're writing allocator glue or testing something very low-level and you _need_ to skip class-specific or placement deletes. For everyday code, stick with plain `delete`.

### Quick checklist

|Expression|What happens|Safe to use|
|---|---|---|
|`delete ptr;`|Runs dynamic destructor, calls matching deallocator|✅|
|`::delete ptr;`|Forces global deallocator; size may be wrong on GCC/Clang|❌|

**Bottom line:** use plain `delete` unless you have a concrete, allocator-level reason to do otherwise.