# Domain Service vs Application Service

## 📊 Comparação Visual

### Domain Service (`domain/course/service/`)
```java
// ✅ LÓGICA DE NEGÓCIO PURA
public class CourseDomainService {
    
    // Regra de negócio: Aluno precisa estar na série correta
    public boolean isGradeLevelEligible(Course course, Integer gradeLevel) {
        return gradeLevel >= course.getGradeLevelMin() 
            && gradeLevel <= course.getGradeLevelMax();
    }
    
    // Regra de negócio: Pré-requisito deve ser cumprido
    public boolean hasPrerequisiteSatisfied(Course course, List<Integer> completed) {
        if (course.getPrerequisiteId() == null) return true;
        return completed.contains(course.getPrerequisiteId());
    }
}
```

**Características:**
- ❌ Sem `@Service`, `@Transactional`, `@Autowired`
- ❌ Sem logging de infraestrutura
- ❌ Sem acesso direto a repositórios
- ✅ Apenas lógica de negócio pura
- ✅ Testável sem Spring/JPA
- ✅ Reutilizável em qualquer contexto

---

### Application Service (`application/course/service/`)
```java
// ✅ ORQUESTRAÇÃO DE CASOS DE USO
@Service
public class CourseService {
    
    private final CourseRepositoryPort repository;
    private final CourseDomainService domainService; // ← Usa Domain Service
    
    @Transactional(readOnly = true)
    public List<CourseDTO> getEligibleCourses(Integer gradeLevel) {
        log.info("Fetching courses"); // ← Logging
        
        // 1. Buscar dados (Infrastructure)
        List<Course> courses = repository.findAll();
        
        // 2. Aplicar regras (Domain)
        List<Course> eligible = courses.stream()
            .filter(c -> domainService.isGradeLevelEligible(c, gradeLevel))
            .collect(toList());
        
        // 3. Converter para DTO (Application)
        return mapper.toDTOList(eligible);
    }
}
```

**Características:**
- ✅ Usa `@Service`, `@Transactional`
- ✅ Faz logging
- ✅ Acessa repositórios
- ✅ Converte entidades para DTOs
- ✅ Coordena Domain + Infrastructure

---

## 🎯 Exemplos Práticos do Projeto

### Domain Service (`CourseDomainService`)

#### 1. Validação de Série
```java
// Regra: Aluno da série 9 não pode fazer curso de série 11
isGradeLevelEligible(course, 9) // false se course.gradeLevelMin = 11
```

#### 2. Validação de Pré-requisito
```java
// Regra: Precisa ter passado em MAT101 antes de fazer MAT102
hasPrerequisiteSatisfied(mat102, [mat101]) // true
hasPrerequisiteSatisfied(mat102, []) // false
```

#### 3. Validação de Cadeia de Pré-requisitos
```java
// Regra: Pré-requisito não pode ser de semestre posterior no mesmo ano
validatePrerequisiteChain(springCourse, fallPrerequisite) // ✅ OK
validatePrerequisiteChain(fallCourse, springPrerequisite) // ❌ Erro
```

#### 4. Cálculo de Créditos
```java
// Regra: Soma todos os créditos dos cursos
calculateTotalCredits([course1(3.0), course2(2.5)]) // 5.5
```

---

### Application Service (`CourseService`)

#### 1. Buscar Cursos Elegíveis
```java
// Orquestra: busca + filtra + converte
getEligibleCoursesForStudent(10, [101, 102])
  → Busca todos cursos (repository)
  → Filtra por série e pré-requisitos (domain service)
  → Retorna lista filtrada
```

#### 2. Matricular Aluno
```java
// Orquestra: busca + valida + salva
enrollStudentInCourse(201, 10, [101, 102])
  → Busca curso (repository)
  → Valida regras (domain service)
  → Cria enrollment (repository)
```

---

## 🔄 Fluxo de Dependência

```
Controller (Infrastructure)
    ↓ chama
Application Service
    ↓ usa
Domain Service (lógica de negócio)
    ↑
Domain Entity (Course)
    ↑
Repository Port (interface)
    ↑ implementado por
Repository Adapter (Infrastructure)
```

---

## ✅ Checklist: Onde colocar?

### Vai para Domain Service se:
- [ ] É uma regra de negócio
- [ ] Não precisa de frameworks
- [ ] Pode ser testado sem Spring/JPA
- [ ] É reutilizável em diferentes contextos
- [ ] Exemplo: "Aluno precisa ter 30 créditos para se formar"

### Vai para Application Service se:
- [ ] Orquestra múltiplas operações
- [ ] Precisa de `@Transactional`
- [ ] Faz logging
- [ ] Converte entidades para DTOs
- [ ] Coordena Domain + Infrastructure
- [ ] Exemplo: "Buscar cursos elegíveis e retornar como DTO"

---

## 📝 Resumo

| Aspecto | Domain Service | Application Service |
|---------|---------------|-------------------|
| **O que faz** | Regras de negócio | Orquestra casos de uso |
| **Dependências** | Apenas Domain | Domain + Infrastructure |
| **Frameworks** | ❌ Nenhum | ✅ Spring, JPA, etc |
| **Testabilidade** | Teste unitário simples | Teste de integração |
| **Exemplo** | `isGradeLevelEligible()` | `getEligibleCourses()` |
