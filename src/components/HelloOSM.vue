<template>
  <div id="plate">
    <div ref="map-root" style="width: 100%; height: 100%"></div>
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
    </div>
    <div style="margin-top: 5px;">
      <b-button variant="outline-primary" v-on:click="addPlace()"
        >Add place</b-button
      >
    </div>
    <!-- Modal edit -->
    <div v-if="showAddModal">
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Add Place</h5>
                  <button
                    type="button"
                    class="close"
                    @click="showEditModal = false"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <div class="col">
                      <input
                        type="text"
                        label="Name"
                        placeholder="Name"
                        v-model="currentPlace.name"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      Type:
                      <select class="form-control" v-model="currentPlace.type">
                        <option
                          v-for="cntr in types"
                          v-bind:value="cntr.id"
                          v-bind:key="cntr.id"
                          >{{ cntr.name }}</option
                        >
                      </select>
                      <br />
                      <button
                        @click="savePlace(currentPlace)"
                        class="btn btn-primary"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import Overlay from "ol/Overlay";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { toLonLat } from "ol/proj";
import { toStringHDMS } from "ol/coordinate";
import GeoJSON from "ol/format/GeoJSON";

export default {
  name: "HelloOSM",
  // props: {
  //   msg: String
  // },
  data: () => ({
    showAddModal: false,
    currentPlace: { type: "", name: "" },
    types: [],
    map: null,
    vectorLayer: null,
    selectedFeature: null,
    geojson: {
      type: "Feature",
      properties: {
        name: "default object",
        quality: "top"
      },
      geometry: {
        type: "MultiPoint",
        coordinates: [
          [47, 39],
          [4427241.2449157, 5975125.047332262]
        ]
      }
    }
  }),
  computed: {
    places() {
      return this.$store.state.places;
    }
  },
  mounted() {
    this.getTypes();
    var container = document.getElementById("popup");
    var content = document.getElementById("popup-content");
    var closer = document.getElementById("popup-closer");

    var overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    closer.onclick = function() {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };

    this.map = new Map({
      target: this.$refs["map-root"],
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      overlays: [overlay],
      view: new View({
        center: [4420889.327398667, 5980433.598421818], //Rostov=On=Don
        zoom: 12
      })
    });

    this.vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: []
      })
    });

    this.map.on("singleclick", function(evt) {
      var coordinate = evt.coordinate;
      var hdms = toStringHDMS(toLonLat(coordinate));
      content.innerHTML = "<p>You clicked here:</p><code>" + hdms + "</code>";
      overlay.setPosition(coordinate);
      console.log(coordinate);
    });

    this.map.on("pointermove", event => {
      const hovered = this.map.forEachFeatureAtPixel(
        event.pixel,
        feature => feature
      );
      if (hovered !== this.selectedFeature) {
        this.$set(this, "selectedFeature", hovered);
      }
    });

    this.updateSource(this.geojson);
    // var marker = new Overlay({
    //   position: [4411586.941289628, 5977418.157014481],
    //   positioning: "center-center",
    //   element: document.getElementById("marker"),
    //   stopEvent: false
    // });
    // map.addOverlay(marker);

    // var popup = new Overlay({
    //   element: document.getElementById("popup")
    // });
    // map.addOverlay(popup);
  },
  methods: {
    updateSource(geojson) {
      const view = this.map.getView();
      const source = this.vectorLayer.getSource();

      const features = new GeoJSON({
        featureProjection: "EPSG:3857"
      }).readFeatures(geojson);

      source.clear();
      source.addFeatures(features);

      view.fit(source.getExtent());
    },
    getTypes() {
      // this.axios
      //   .get(`dummyAPI`, {})
      //   .then(r => {
      //     this.types = r.data;
      //   })
      //   .catch(e => {
      //     // this.$notify({
      //     //   title: "Ошибка",
      //     //   horizontalAlign: "left",
      //     //   verticalAlign: "bottom",
      //     //   type: "danger"
      //     // });
      //     console.log(e);
      //   });
    },
    addPlace() {
      this.showAddModal = true;
    },
    savePlace() {
      this.$store.dispatch("addPlace", this.currentPlace);
    }
  }
};
</script>
<style>
#plate {
  width: 100vw;
  height: 80vh;
}

.map {
  width: 100%;
  height: 400px;
}
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "✖";
}
</style>