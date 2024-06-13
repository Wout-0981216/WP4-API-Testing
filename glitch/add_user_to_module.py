from game.models import *

def add_user_to_module(student, module):
    VoortgangConceptOpdrachten.objects.create(
        student = student,
        concept_opdracht = ConceptOpdracht.objects.get(module=module)
    )
    VoortgangHoofdOpdrachten.objects.create(
        student = student,
        hoofd_opdracht = HoofdOpdrachten.objects.get(module=module)
    )
    VoortgangPuntenUitdaging.objects.create(
        student = student,
        punten_uitdaging = PuntenUitdagingen.objects.get(module=module)
    )
    activiteiten = Activiteiten.objects.filter(module=module)
    for activiteit in activiteiten:
        niveaus = Niveaus.objects.filter(activiteit=activiteit)
        for niveau in niveaus:
            VoortgangActiviteitenNiveaus.objects.create(
                student = student,
                niveau = niveau
            )